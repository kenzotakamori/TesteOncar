$(document).ready(function(){
    const url = 'http://127.0.0.1:3000/';
    var availableVehicles = [];
    var vehiclesToBeShown = [];
    var selectedVehicle = { id: null };

    function init() {
        getVehicleTemplate();
        getAvailableVehicles();
        addFunctionToButtons();
        addModalReferences();
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
        })
    }

    function mountVehicleDetails() {
        let v = selectedVehicle;
        $('.details').find('h3').text(v.veiculo);
        $('.details').find('.brand-value').text(v.marca);
        $('.details').find('.year-value').text(v.ano);
        $('.details').find('p').text(v.descricao);
    }


    function addFunctionToButtons() {
        addSearchButtonFunction();
        setNewVehicleModal();
        setVehicleModal();
        addDeleteVehicleFunction();
    }

    function addSearchButtonFunction() {
        $(".search-button").click(function() {
            //get input
            console.log('search added')
            let str;
            filterResultsByString(str);
        });
    }

    function setNewVehicleModal() {
        $(".add-vehicle").click(function() {
            //limpar campos
        });
    }

    function setVehicleModal() {
        // usar selected modal
    }

    function addModalReferences() {
        $(".edit-modal").load('templates/add-edit-vehicle-modal.html');
        $(".delete-modal").load('templates/delete-vehicle-modal.html');
    }

    function addDeleteVehicleFunction() {
        $(".edit-button").click(function() {
            //TODO
        });
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