(function(){
    new Sandbox('$ajax', '$util', function($ajax, $util) {
    $('#modal_remove').on('hide.bs.modal', function(event) {
        $('#form_modal_remove').unbind('submit');
    });
    $('#modal_remove').on('show.bs.modal', function(event) {
        var id = $(event.relatedTarget).data('id');
        var description = $(event.relatedTarget).data('description');
        var model = $(event.relatedTarget).data('model');
        var modal = $(event.relatedTarget).data('modal');
        var toggle = $(event.relatedTarget).data('toggle');

        $('#modal_remove_id').val(id);
        $('#modal_remove_message').html('Deseja realmente excluir o registro <b>' + description  + '</b>?');

        

        var remove = function remove(event) {
            event.preventDefault();
            

            if(modal) {
                $('#' + model + id.toString()).remove();
                $('#modal_remove').modal('hide');
            } else {
                $ajax.delete(model, id).done(function(data) {
                  $util.redirectWithMessage({message:data, location:window.location.href, type:'success'});                    
                  
                }).fail(function(data) {
                    $('#modal_remove').modal('hide');
                    $util.showErrorMessage(data);
                });
            }

        };

        $('#form_modal_remove').on('submit', remove);
    });


});

})();