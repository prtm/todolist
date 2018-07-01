function pacmanShow() {
    $('#pacman-container').prop('hidden', false);
    var loader = $('#loader');
    var img = loader.find('img');
    var top = $(window).height() / 2 - 100;
    var left = $(window).width() / 2 - 100;


    loader.css('top', top);
    loader.css('left', left);

    console.log('show pacman');
}

function pacmanHide() {
    console.log('hide pacman');
    $('#pacman-container').prop('hidden', true);
}

function checkboxClickListener() {
    $('.checkBoxGroup').on('click', function (e) {
        var checkBox = e.target
        var divText = $(checkBox).closest('div.row').find('div.col-sm-6')
        var divDate = $(checkBox).closest('div.row').find('div.col-sm-4')
        if ($(checkBox).is(':checked')) {
            divText.css('text-decoration', 'line-through')
            divDate.css('text-decoration', 'line-through')
        } else {
            divText.css('text-decoration', 'none')
            divDate.css('text-decoration', 'none')
        }

        var divDelete = $(checkBox).closest('div.row').find('div.deleteGroup')
        var id = $(divDelete).data('id')

        $.ajax({
            type: 'PATCH',
            contentType: "application/json",
            url: '/api/v1/task/' + id + "/",
            data: JSON.stringify({
                "is_task_completed": $(checkBox).is(':checked')
            }),
            dataType: 'json',
            complete: function (data) {
                console.log(data);
            },
            error: function (xhr) {
                console.log(xhr)
            }
        });
    });
}


function deleteButtonListener() {
    $('.deleteGroup').on('click', function (e) {
        var deleteIcon = e.target
        var id = $(deleteIcon).closest('div').data('id')
        console.log(id);
        var li = $(deleteIcon).closest('li')


        // use this when server side delete
        $.ajax({
            type: 'PATCH',
            contentType: "application/json",
            url: '/api/v1/task/' + id + "/",
            data: JSON.stringify({
                "is_deleted": true
            }),
            dataType: 'json',
            complete: function (data) {
                console.log(data);
                $(li).remove()
            },
            error: function (xhr) {
                console.log(xhr)
            }
        });

    });
}

function restoreButtonClickListener() {
    $('.restoreGroup').on('click', function (e) {
        var deleteIcon = e.target
        var li = $(deleteIcon).closest('li')


        var divDelete = $(deleteIcon).closest('div.row').find('div.permanentDeleteGroup')
        var id = $(divDelete).data('id')
        console.log(id);
        // use this when server side delete
        $.ajax({
            type: 'PATCH',
            contentType: "application/json",
            url: '/api/v1/task/' + id + "/",
            data: JSON.stringify({
                "is_deleted": false
            }),
            dataType: 'json',
            complete: function (data) {
                console.log(data);
                $(li).remove()
            },
            error: function (xhr) {
                console.log(xhr)
            }
        });

    });
}


function permanentDeleteButtonClickListener() {
    $('.permanentDeleteGroup').on('click', function (e) {
        var deleteIcon = e.target
        var id = $(deleteIcon).closest('div').data('id')
        console.log(id);
        var li = $(deleteIcon).closest('li')


        // use this when server side delete
        $.ajax({
            type: 'DELETE',
            contentType: "application/json",
            url: '/api/v1/task/' + id + "/",
            success: function (data) {
                console.log(data);
                $(li).remove()
            },
            error: function (xhr) {
                console.log(xhr)
            }
        });

    });

}


function homeClickListener() {

    $('#home').one('click', function (e) {
        pacmanShow()
        $.ajax({
            url: "/api/v1/task/",
            type: "get", //send it through get method
            data: {
                'is_deleted': false
            },
            success: function (response) {
                pacmanHide()
                trashClickListener()
                $('#heading').text('Tasks')
                data = response['objects']
                content = $('#content').empty()
                for (var i = 0; i < data.length; i++) {
                    $(content).append('<li class="list-group-item"> <div class = "row">\
                    <div class="col-sm-1"> <div class="round">' +
                        (data[i]['is_task_completed'] ? '<input type="checkbox" id="checkbox' + i + '" checked class="checkBoxGroup" />' :
                            '<input type="checkbox" id="checkbox' + i + '" class="checkBoxGroup" />') +
                        '<label for="checkbox' + i + '"></label> \
                    </div> </div>' +

                        (data[i]['is_task_completed'] ? '<div class="col-sm-6 pT4" style="text-decoration: line-through;">'

                            :
                            '<div class="col-sm-6 pT4">')

                        +
                        (data[i]['has_sub_tasks'] ? '<a href="#">' :
                            '') +
                        data[i]['title'] +
                        (data[i]['has_sub_tasks'] ? '</a>' : '') +
                        '</div>' +
                        (data[i]['is_task_completed'] ? '<div class="col-sm-4" style="text-decoration: line-through">' :
                            '<div class="col-sm-4">')

                        +
                        data[i]['due_date'] +
                        '</div> <div class="col-sm-1 deleteGroup"\
                                                    data-id = "' +
                        data[i]['id'] +
                        '" ><i class = "fa fa-trash" aria-hidden = "true" > </i> </div> </div> </li>')


                }
                checkboxClickListener()
                deleteButtonListener()


            },
            error: function (xhr) {
                //Do Something to handle error
                pacmanHide()
                console.log(xhr);
                homeClickListener()
            }
        });

    });



}


function trashClickListener() {

    $('#trash').one('click', function (e) {
        pacmanShow()
        $.ajax({
            url: "/api/v1/task/",
            type: "get", //send it through get method
            data: {
                'is_deleted': true
            },
            success: function (response) {
                pacmanHide()
                homeClickListener()
                var heading = $('#heading')
                heading.text('Deleted')
                heading.append('<p style="color:red;">Automatically deleted after 30 days</p>')
                data = response['objects']
                content = $('#content').empty()
                for (var i = 0; i < data.length; i++) {
                    $(content).append('<li class="list-group-item"> <div class = "row">\
                                            <div class = "col-sm-1 restoreGroup" >\
                                            <i class="fas fa-undo"></i> </div>' +

                        (data[i]['is_task_completed'] ? '<div class="col-sm-6 pT4" style="text-decoration: line-through;">'

                            :
                            '<div class="col-sm-6 pT4">')

                        +
                        (data[i]['has_sub_tasks'] ? '<a href="#">' :
                            '') +
                        data[i]['title'] +
                        (data[i]['has_sub_tasks'] ? '</a>' : '') +
                        '</div>' +
                        (data[i]['is_task_completed'] ? '<div class="col-sm-4" style="text-decoration: line-through">' :
                            '<div class="col-sm-4">')

                        +
                        data[i]['due_date'] +
                        '</div> <div class="col-sm-1 permanentDeleteGroup"\
                                                    data-id = "' +
                        data[i]['id'] +
                        '" ><i class = "fa fa-trash" aria-hidden = "true" > </i> </div> </div> </li>')


                }

                restoreButtonClickListener()
                permanentDeleteButtonClickListener()


            },
            error: function (xhr) {
                //Do Something to handle error
                pacmanHide()
                console.log(xhr);
                trashClickListener()

            }
        });
    });


}

$(function () {
    checkboxClickListener()
    deleteButtonListener()
    trashClickListener()
});