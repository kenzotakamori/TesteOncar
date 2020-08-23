$(document).ready(function(){
    const url = 'http://127.0.0.1:3000/';
    var availableVehicles = [];
    var vehiclesToBeShown = [];
    var selectedVehicle = {};

    function init() {
        getVehicleTemplate();
        getAvailableVehicles();
        addFunctionToButtons();
        addModalReferences();
        addFunctionModals();
    }

    var vehicleTemplate;
    function getVehicleTemplate() {
        $.get("templates/vehicle-tile.html", function(data){
            vehicleTemplate = data;
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
        addSaveButtonFunction();
        addDeleteButtonFunction();
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
        });
    }

    function setVehicleModal() {
        $('.edit-button').click(function(){
            setValuesModal(selectedVehicle);
        });
    }

    function setValuesModal(item) {
        $('input[name="vehicle"]').val(item.veiculo);
        $('input[name="brand"]').val(item.marca);
        $('input[name="year"]').val(item.ano);
        $('textarea').val(item.descricao);
        $('input[name="vendido"]').val(item.vendido);
    }

    function addSaveButtonFunction() {
        $('.save-edits').click(function(){
            //TODO
        });
    }

    function addDeleteButtonFunction() {
        $('.delete-vehicle').click(function(){
            //TODO
        });
    }

    function addModalReferences() {
        $(".edit-modal").load('templates/add-edit-vehicle-modal.html');
        $(".delete-modal").load('templates/delete-vehicle-modal.html');
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
    
    function resetResults() {
        selectedVehicle = {};
        mountVehiclesList();
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

    init();
})