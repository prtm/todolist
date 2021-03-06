function pacmanShow() {
    $('#pacman-container').prop('hidden', false);
    var loader = $('#loader');
    var img = loader.find('img');
    var top = $(window).height() / 2 - 100;
    var left = $(window).width() / 2 - 100;


    loader.css('top', top);
    loader.css('left', left);

}

function pacmanHide() {
    $('#pacman-container').prop('hidden', true);
}

function checkboxClickListener() {
    $('.checkBoxGroup').on('click', function (e) {
        var checkBox = e.target
        console.log('clicked');

        var divText = $(checkBox).closest('div.card-body').find('h5.card-title')
        var divDate = $(checkBox).closest('div.card-body').find('p.card-text')
        if ($(checkBox).is(':checked')) {
            divText.css('text-decoration', 'line-through')
            divDate.css('text-decoration', 'line-through')
        } else {
            divText.css('text-decoration', 'none')
            divDate.css('text-decoration', 'none')
        }

        var divDelete = $(checkBox).closest('div.card-body').find('div.deleteGroup')
        var id = $(divDelete).data('id')

        $.ajax({
            type: 'PATCH',
            contentType: "application/json",
            url: '/api/v1/sub-task/' + id + "/",
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
        var div = $(deleteIcon).closest('div')
        var id = $(div).data('id')
        console.log('sub_task: ' + id);

        var container = $(deleteIcon).closest('div.shadow-sm')


        // use this when server side delete
        $.ajax({
            type: 'PATCH',
            contentType: "application/json",
            url: '/api/v1/sub-task/' + id + "/",
            data: JSON.stringify({
                "is_deleted": true
            }),
            dataType: 'json',
            complete: function (data) {
                console.log(data);
                $(container).remove()
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
            url: '/api/v1/sub-task/' + id + "/",
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
            url: '/api/v1/sub-task/' + id + "/",
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


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


function fillSubTasks(data) {

    content = $('#content').empty()
    var html = '';
    for (var i = 0; i < data.length; i++) {
        html += (i % 3 == 0 ? '<div class="row shadow-sm">' : '') +
            '<div class="col-sm-4">\
            <div class="card">\
                <div class="card-body">\
                    <div class="row">\
                        <div class="col-sm-10">' +
            (data[i]['is_task_completed'] ?
                '<h5 class="card-title" style="text-decoration: line-through;">' + data[i]['title'] + '</h5>' :
                '<h5 class="card-title">' + data[i]['title'] + '</h5>') +
            '</div>\
                        <div class="col-sm-2 deleteGroup" data-id="' + data[i]['id'] + '">\
                            <i class="fa fa-trash" aria-hidden="true"></i>\
                        </div>\
                    </div>' +
            (data[i]['is_task_completed'] ?
                '<p class="card-text" style="text-decoration: line-through;">' + data[i]['due_date'] + '</p>' :
                '<p class="card-text">' + data[i]['due_date'] + '</p>') +
            '<div class="row">\
                        <div class="col-sm-12">\
                            <div class="round">' +
            (data[i]['is_task_completed'] ?
                '<input type="checkbox" id="checkbox' + i + '" checked class="checkBoxGroup" />' :
                '<input type="checkbox" id="checkbox' + i + '" class="checkBoxGroup" />') +
            '<label for="checkbox' + i + '"></label>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>' +
            ((i + 1) % 3 == 0 ? '</div>' : i == (data.length - 1) ? '</div>' : '');
    }

    $(content).append(html)

}



function dateFilter(code) {
    console.log(code);

    var today = new Date();
    var dd = ("0" + today.getDate()).slice(-2)
    var mm = ("0" + (today.getMonth() + 1)).slice(-2)
    var yyyy = today.getFullYear();

    var dict = {}; // create an empty array
    $('#date-filter').text(code)



    if (code == "today") {
        var value1 = yyyy + "-" + mm + "-" + dd
        dict['due_date'] = value1
    } else if (code == "this-week") {
        var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6;
        var curr = new Date();
        var first = new Date(curr.setDate(first));
        var last = new Date(curr.setDate(last))
        console.log(first, last);

        var value1 = first.getFullYear() + "-" + ("0" + (first.getMonth() + 1)).slice(-2) + "-" + ('0' + first.getDate()).slice(-2);
        value1 = value1 + "," + last.getFullYear() + "-" + ("0" + (last.getMonth() + 1)).slice(-2) + "-" + ('0' + last.getDate()).slice(-2);

        dict['due_date__range'] = value1

    } else if (code == "next-week") {
        var first = today.getDate() - today.getDay() + 7; // First day is the day of the month - the day of the week
        var last = first + 6;
        var curr = new Date();
        var first = new Date(curr.setDate(first));
        var last = new Date(curr.setDate(last))
        var value1 = first.getFullYear() + "-" + ("0" + (first.getMonth() + 1)).slice(-2) + "-" + ('0' + first.getDate()).slice(-2);
        value1 = value1 + "," + last.getFullYear() + "-" + ("0" + (last.getMonth() + 1)).slice(-2) + "-" + ('0' + last.getDate()).slice(-2);

        dict['due_date__range'] = value1
    } else {
        var value1 = yyyy + "-" + mm + "-" + dd;
        dict['due_date__gte'] = value1
    }

    console.log(dict);



    $.ajax({
        url: "/api/v1/sub-task/",
        type: "get", //send it through get method
        data: dict,
        success: function (response) {
            $('#pagination').prop('hidden', true)
            pacmanHide()
            trashClickListener()
            $('#heading').text('Tasks')
            data = response['objects']

            // fill data
            fillSubTasks(data)


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
}


function homeClickListener() {

    $('#home').one('click', function (e) {
        pacmanShow()
        $('#pagination').prop('hidden', false)
        var page = getUrlParameter('page')
        if (page == null) {
            page = 1
        }

        var path = window.location.pathname.split('/')
        var task_id = path[2]



        $.ajax({
            url: "/api/v1/sub-task/",
            type: "get", //send it through get method
            data: {
                'parent_task': task_id,
                'limit': 10,
                'offset': 10 * (page - 1),
                'is_deleted': false
            },
            success: function (response) {
                pacmanHide()
                trashClickListener()
                $('#heading').text('Sub Tasks')
                data = response['objects']
                fillSubTasks(data)

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
        // var page = getUrlParameter('page')
        $('#pagination').prop('hidden', true)
        var path = window.location.pathname.split('/')
        var task_id = path[2]
        console.log(task_id);
        $.ajax({
            url: "/api/v1/sub-task/",
            type: "get", //send it through get method
            data: {
                'parent_task': task_id,
                'limit': 10,
                'offset': 0,
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

    $('#search-form').on('submit', function (e) {
        e.preventDefault();

        var q = $('#search-input').val();
        var is_deleted;
        if ($('#heading').text() == "Sub Tasks") {
            is_deleted = false;
        } else {
            is_deleted = true;
        }
        pacmanShow()
        $.ajax({
            url: "/api/v1/task/search/",
            type: "get", //send it through get method
            data: {
                'q': q,
                'limit': 20,
                'offset': 0,
                'is_deleted': is_deleted
            },
            success: function (response) {
                window.history.pushState("", "", '/sub-tasks/');
                pacmanHide()
                trashClickListener()
                $('#heading').text('Search Results [ Max 20 Results ]')
                $('#pagination').hide()
                data = response['objects']
                console.log(data);


                // fill data
                fillSubTasks(data)


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


    $('#today').on('click', function (e) {
        dateFilter("today")
    });
    $('#this-week').on('click', function (e) {
        dateFilter("this-week")
    });
    $('#next-week').on('click', function (e) {
        dateFilter("next-week")
    });
    $('#over-due').on('click', function (e) {
        dateFilter("over-due")
    });
});