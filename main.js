$(document).ready(function(){
    const url = 'http://127.0.0.1:3000/';
    var availableVehicles = [];
    var vehiclesToBeShown = [];

    function init() {
        getAvailableVehicles();
        addFunctionToButtons();
        addModalReferences();
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
        })
    }

    function clearListOptions() {
        $('.list-options').empty();
    }

    function buildVehicleTile(item) {
        //copy from template
        let tile;
        $.get("templates/vehicle-tile.html", function(data){
            tile = $.parseHTML(data);
            $(tile).find('.brand').text(item.marca);
            $(tile).find('.model').text(item.veiculo);
            $(tile).find('.release-year').text(item.ano);
            $('.list-options').append(tile);
        });
        
    }

    function addFunctionToButtons() {
        addSearchButtonFunction();
        addNewVehicleButtonFunction();
        addOpenVehicleDetailsFunction();
        addEditVehicleFunction();
        addDeleteVehicleFunction();
    }

    function addSearchButtonFunction() {
        $(".search-button").click(function() {
            //get input
            let str;
            filterResultsByString(str);
        });
    }

    function addNewVehicleButtonFunction() {
        $(".add-vehicle").click(function() {
            openVehicleModal();
        });
    }

    function addEditVehicleFunction() {
        // $(".edit-button").click(function() {
        //     //get ID
        //     openVehicleModal(id);
        // });
    }

    function addDeleteVehicleFunction() {
        
    }

    function addModalReferences() {
        $(".edit-modal").load('templates/add-edit-vehicle-modal.html');
        $(".edit-modal").load('templates/delete-vehicle-modal.html');
    }

    function openVehicleModal(id) {
        //copy template of modal
        if(id) {
            getVehicleById();
        }
        //should open a new one, or 
        //open modal
    }

    function getVehicleById() {

    }

    function addDeleteVehicleFunction() {
        $(".edit-button").click(function() {
            //TODO
        });
    }

    function addOpenVehicleDetailsFunction() {

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