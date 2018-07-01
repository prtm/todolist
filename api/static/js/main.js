$(function () {
    // CHECKBOX CLICK LINE THROUGH
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
            }
        });
    });


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
            }
        });


        // $.ajax({
        //     type: 'DELETE',
        //     url: '/api/v1/task/' + id + "/",
        //     complete: function (data) {
        //         console.log(data);
        //         $(li).remove()
        //     }
        // });

    });


    $('#trash').on('click', function (e) {
        // /api/v1/task/?is_deleted=true
        console.log('clicked');
        

        $.ajax({
            url: "/api/v1/task/",
            type: "get", //send it through get method
            data: {
                'is_deleted': true
            },
            success: function (response) {
                //Do Something
                // console.log(response);
                data = response['objects']
                content = $('#content').empty()
                for(var i=0; i< data.length;i++){
                    
                }
                

            },
            error: function (xhr) {
                //Do Something to handle error
                console.log(xhr);

            }
        });
    });


});