$(document).ready(function(){
    const url = 'http://127.0.0.1:3000/';
    var availableVehicles = [];
    var vehiclesToBeShown = [];
    var selectedVehicle = {};

    function init() {
        getVehicleTemplate();
        addModalReferences();
        addFunctionToButtons();
    }

    var vehicleTemplate;
    function getVehicleTemplate() {
        $.get("templates/vehicle-tile.html", function(data){
            vehicleTemplate = data;
            getAvailableVehicles();
        });
    }

    function getAvailableVehicles() {
        $.get(url + 'api/veiculos',function(response){
            availableVehicles = response;
            vehiclesToBeShown = availableVehicles;
            mountVehiclesList();
        })
    }

    function mountVehiclesList() {
        clearListOptions();
        vehiclesToBeShown.forEach(function(item) {
            let tile = buildVehicleTile(item);
            $('.list-options').append(tile);
        });
        selectVehicleOnClick();
    }

    function clearListOptions() {
        $('.list-options').empty();
    }

    function buildVehicleTile(item) {
        let tile = $.parseHTML(vehicleTemplate);
        $(tile).attr('id', item.id);
        $(tile).find('.brand').text(item.marca);
        $(tile).find('.model').text(item.veiculo);
        $(tile).find('.release-year').text(item.ano);
        $('.list-options').append(tile);   
    }

    function selectVehicleOnClick() {
        $(".open-details").click(function() {
            let clickedTile = $(this).parent();
            let id = clickedTile.prop('id');
            selectedVehicle = vehiclesToBeShown.filter(function(item){
                return id == item.id;
            })[0];
            mountVehicleDetails();
            showVehicleDetails();
        })
    }

    function mountVehicleDetails() {
        let v = selectedVehicle;
        $('.details').find('h3').text(v.veiculo);
        $('.details').find('.brand-value').text(v.marca);
        $('.details').find('.year-value').text(v.ano);
        $('.details').find('p').text(v.descricao);
    }

    function showVehicleDetails() {
        if ($('.details').hasClass('inactive')) {
            $('.details').removeClass('inactive');
            $('.not-selected').addClass('inactive');
            $('.delete-button').prop("disabled", false);
            $('.edit-button').prop("disabled", false);
        }
    }

    function addFunctionToButtons() {
        addSearchButtonFunction();
        setNewVehicleModal();
        setVehicleModal();
    }

    function addSearchButtonFunction() {
        $(".search-button").click(function() {
            let str = $('.search').val();
            vehiclesToBeShown = filterResultsByString(str);
            resetResults();
        });
    }

    function setNewVehicleModal() {
        $(".add-vehicle").click(function() {
            setValuesModal({});
            $('#detailModal').attr('tag', 'POST');
        });
    }

    function setVehicleModal() {
        $('.edit-button').click(function(){
            setValuesModal(selectedVehicle);
            $('#detailModal').attr('tag', 'PUT');
        });
    }

    function setValuesModal(item) {
        $('input[name="vehicle"]').val(item.veiculo);
        $('input[name="brand"]').val(item.marca);
        $('input[name="year"]').val(item.ano);
        $('textarea').val(item.descricao);
        $('input[name="vendido"]').val(item.vendido);
    }

    function addModalReferences() {
        $(".edit-modal").load('templates/add-edit-vehicle-modal.html', function(){
            addSaveButtonFunction();
        });
        $(".delete-modal").load('templates/delete-vehicle-modal.html', function(){
            addDeleteButtonFunction();
        });
    }
    
    var errorMessage = '';
    function addSaveButtonFunction() {
        $('.save-edits').click(function(){
            let tag = $('#detailModal').attr('tag');
            let body = getRequestBody();
            let valid = isRequestBodyValid(body);
            if (!valid) {
                displayErrorMessage();
                return
            }
            let urlRequest;
            if (tag === "POST") {
                urlRequest = url + 'api/veiculos';
                postOrPutRequest(tag, body, urlRequest);            
            } else if (tag === "PUT") {
                urlRequest = url + 'api/veiculos/' + selectedVehicle.id;
                postOrPutRequest(tag, body, urlRequest);
            }
        });
    }

    function getRequestBody() {
        let body = {
            veiculo: $('input[name="vehicle"]').val(),
            marca: $('input[name="brand"]').val(),
            ano: $('input[name="year"]').val(),
            descricao: $('textarea').val(),
            vendido: false,
            created: '2020-08-23 13:00:00',
            updated: '2020-08-23 13:00:00'
        };
        return body;
    }

    function isRequestBodyValid(body) {
        if (body.veiculo.length < 3) {
            errorMessage = 'VEÍCULO deve ter ao menos 3 caracteres.';
            return false;
        }

        if (body.marca.length < 3) {
            errorMessage = 'MARCA deve ter ao menos 3 caracteres.';
            return false;
        }

        if (body.ano < 1000 || body.ano > 2020) {
            errorMessage = 'ANO inválido.';
            return false;
        }

        if (body.descricao.length < 30) {
            errorMessage = 'Descrição deve ter ao menos 30 caracteres.';
            return false;
        }
        return true;
    }

    function displayErrorMessage() {
        $('#detailModal').find('p').text(errorMessage);
    }

    function postOrPutRequest(tag, body, urlRequest) {
        $.ajax({
            type: tag,
            url: urlRequest,
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function() {
                $('#detailModal').modal('hide');
                resetResults();
            }
        });
    }

    function addDeleteButtonFunction() {
        $('.delete-vehicle').click(function(){
            let id = selectedVehicle.id;
            let deleteUrl = url + 'api/veiculos/' + id;
            $.ajax({
                url: deleteUrl,
                type: 'DELETE',
                success: function() {
                    $('#detailModal').modal('hide');
                    resetResults();
                }
            })
        });
    }

    function resetResults() {
        getAvailableVehicles();
        hideVehicleDetails();
    }

    function hideVehicleDetails() {
        if ($('.not-selected').hasClass('inactive')) {
            $('.details').addClass('inactive');
            $('.not-selected').removeClass('inactive');
            $('.delete-button').prop("disabled", true);
            $('.edit-button').prop("disabled", true);
        }
    }

    function filterResultsByString(str) {
        if(str) {
            return availableVehicles.filter(function(item) {
                return firstStringContainsSecond(item.marca, str) || firstStringContainsSecond(item.modelo, str)
                    || firstStringContainsSecond(item.marca, str) 
            })
        } else {
            return availableVehicles;
        }
    }

    function firstStringContainsSecond (first, second) {
        return first.indexOf(second) >= 0;
    }

    init();
})