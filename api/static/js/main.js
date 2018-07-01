$(function () {
    // CHECKBOX CLICK LINE THROUGH
    $('.checkBoxGroup').on('click', function (e) {
        var checkBox = e.target
        var divText = $(checkBox).closest('div.row').find('div.col-sm-10')
        if ($(checkBox).is(':checked')) {
            divText.css('text-decoration', 'line-through')
        } else {
            divText.css('text-decoration','none')
        }
    });

    


});