$(function () {
    // CHECKBOX CLICK LINE THROUGH
    $('.checkBoxGroup').on('click', function (e) {
        var checkBox = e.target
        var divText = $(checkBox).closest('div.row').find('div.col-sm-6')
        var divDate = $(checkBox).closest('div.row').find('div.col-sm-5')
        if ($(checkBox).is(':checked')) {
            divText.css('text-decoration', 'line-through')
            divDate.css('text-decoration', 'line-through')
        } else {
            divText.css('text-decoration','none')
            divDate.css('text-decoration','none')
        }
    });


});