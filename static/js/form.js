$(document).ready(function(){

    $('#submit').click(function(){
        
        $.ajax({
            headers: { 'X-CSRFToken': csrf_token },
            type: 'POST',
            url: 'ajax_data/',  // 這邊會導向/new_app/ajax_data/這個url
            data: $('#ajax_form').serialize(),
            success: function(response){ 
                $("#message").html('<div class="alert alert-warning">' + response.message + '</div>');
            },//回傳response
            error: function(){
                alert('Something error');
            },
        });
    });
});