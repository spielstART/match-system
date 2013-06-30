$(document).ready(function() {
     
     $(document).on("click", ".openForm", function () {
        alert("Dat Click!");
        var UserId = $(this).data('id');
        $(".modal-body #bookId").val( myBookId );
    });
});


