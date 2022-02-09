/*
 * Assignment 2 COMPX322-20A
 * Student ID: 1318613
 * Due Date: 5PM Friday 8th May 2020
 * Worth 20%
 */

//Stock Widget Constructor 														//==========================================================================
function StockWidget(container_element) {

	//declare the data properties of the object
    var _sort = 1;
    var _container = container_element;
	var _selected_companies = [];
	var _companies = ["Select Company",		//could replace this by using php to get the names of the stocks
					  "NZ Wind Farms",		//so if new stocks are added to the database the code wouldnt need updating
					  "Foley Wine Inc",
					  "Geneva Finance",
					  "Xero Accounts",
					  "Moa Group Ltd",
					  "Solid Dynamics"];




	//declare an inner object literal to represent the widget's UI
    var widget = {
        titlebar: null,															//All set to null as they will be created later in the _createUI function
        title: null,
		toolbar: null,
        companyDropDown: null,
		sortByName: null,
		sort0Label: null,
        sortByPrice: null,
		sort1Label: null,
		listheader: null,
		list: null,
		companyheader: null,													//these three elements i had to add as i couldnt get my css to work
		priceheader: null,														//the header text was originally meant to be the inner html of list header only
		movementheader: null													//not seperate elements for each header
    }

    //function to create and configure the DOM elements for the UI
    //explicitly called when the object is created to make it visible
    var _createUI = function(container_element){

        //Titlebar
        widget.titlebar = document.createElement("div");						//creates the titlebar div element
        widget.titlebar.innerHTML = "Stock Widget";								//adds the title text of the widget to the div element
		widget.titlebar.className = "titlebar";									//adds class

		//Title
		widget.title = document.createElement("span");							//create title element as span
		widget.innerHTML = "Stock Widget";										//add text to title

        //Toolbar
        widget.toolbar = document.createElement("div");							//creat the toolbar div element
        widget.titlebar.className = "toolbar";									//adds class

        //DROP DOWN
        widget.companyDropDown = document.createElement("select");				//creates select element which is the main element of the dropdown menu
        widget.companyDropDown.onchange = function() {							//defines what happens when option in the list is selected
            requestStock(widget.companyDropDown.value); 						//requests the selected options stock information
        }
        for(i = 0; i < _companies.length; i++)									//loop through company list to add them as options to the dropdown menu
            {
                option = document.createElement('option');						//creates option element
                option.innerHTML = _companies[i];								//adds options name
                option.value = _companies[i];									//gives the option a value which is the company name
                widget.companyDropDown.appendChild(option);						//adds the option to the dropdown
            }

        //SORT BY NAME
        widget.sortByName = document.createElement("input");					//creates an input element for sort by name
		widget.sortByName.setAttribute("type","radio");							//adds the type of input the element is
		widget.sortByName.setAttribute("name","sortType");						//adds name of the option
		widget.sortByName.setAttribute("id","sort0"); 							//adds id to group the radio buttons
		widget.sortByName.checked = false;										//makes option the unselected by default
        widget.sortByName.className = "sortinput";								//adds class for css
        widget.sortByName.onclick = function(){									//defines what happens when option is selected
            _sort = 0;															//sets sort to 0 used later when displaying
            displayList();														//redisplays list sorted by name
        }
		widget.sort0Label = document.createElement("label");					//creates thhe sort by price label
		widget.sort0Label.setAttribute("for","sort0");							//sets the element the label is for
		widget.sort0Label.innerHTML = "sort by Name";							//sets the text for the label
		widget.sort0Label.className = "toollabel";								//adds class for css


		//SORT BY PRICE
        widget.sortByPrice = document.createElement("input");					//same steps as sort by price
		widget.sortByPrice.setAttribute("type","radio");
		widget.sortByPrice.setAttribute("name","sortType");
		widget.sortByPrice.setAttribute("id","sort1");
		widget.sortByPrice.checked = true;
        widget.sortByPrice.className = "sortinput";
        widget.sortByPrice.onclick = function(){
            _sort = 1;
            displayList();
        }
		widget.sort1Label = document.createElement("label");
		widget.sort1Label.setAttribute("for","sort1");
		widget.sort1Label.innerHTML = "sort by price";
		widget.sort1Label.className = "toolLabel";


		//STOCK LIST
		widget.listheader = document.createElement("div");						//Create the list head div
		widget.listheader.className = "headerbar"								//adds class
		//widget.listheader.innerHTML = "Company "+"Price "+"Movement";			//original header no longer user

		widget.companyheader = document.createElement("span");					//Create the headers
		widget.priceheader = document.createElement("span");
		widget.movementheader = document.createElement("span");
		widget.companyheader.innerHTML = "Company"+"\t";						//add header text
		widget.priceheader.innerHTML = "Price"+"\t";
		widget.movementheader.innerHTML = "Movement"+"\t";
		widget.companyheader.className = "companyheader";
		widget.priceheader.className = "priceheader";
		widget.movementheader.className = "movementheader";
		widget.listheader.appendChild(widget.companyheader);					//add headers to list header
		widget.listheader.appendChild(widget.priceheader);
		widget.listheader.appendChild(widget.movementheader);
        widget.list = document.createElement("div");							//Create the list div


		//ADD TITLE TO TITLEBAR
		widget.titlebar.appendChild(widget.title);

		//ADD TOOLS TO TOOL BAR
        widget.toolbar.appendChild(widget.companyDropDown);						//Add drop down menu to toolbar
		widget.toolbar.appendChild(widget.sort0Label);							//Add sort by name label to toolbar
        widget.toolbar.appendChild(widget.sortByName);							//Add sort by name radio button to toolbar
		widget.toolbar.appendChild(widget.sort1Label);							//Add sort by price label to toolbar
        widget.toolbar.appendChild(widget.sortByPrice);							//Add sort by price radio button to toolbar


        //ADD ELEMENTS TO WIDGET CONTAINER
        _container.appendChild(widget.titlebar);								//Add title bar to widget container
        _container.appendChild(widget.toolbar);									//Add tool bar to widget container
		_container.appendChild(widget.listheader);								//Add list header widget container
        _container.appendChild(widget.list);									//Add list tp widget container
    }

	//Defines how AJAX Requests are made and how they are handled				//==========================================================================
	//From assignment 1
    function ajaxRequest(url, method, data, callback)
    {
		//create request object and open it with the passed data and method
		let request = new XMLHttpRequest();
		request.open(method, url, true);

		//if the method is post create the request header
		//post requests are handled differently from get
		if(method == "POST"){
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

		//check that the request was successful and complete
		//get response and call callback passed in when request was made
        request.onreadystatechange = function(){
            if(request.readyState == 4){
                if(request.status == 200){
					//console.log(request.responseText);

                    response = JSON.parse(request.responseText);
                    callback(response);
                }
                else{
                    handleError(request.statusText);
                }
            }
        };

        request.send(data);
    }

	//The code below handles the user selecting an option form the drop down	//==========================================================================

	/*
     *Step One: requestStock
	 *The option selected is passed in
	 *The selected companies array is checked
	 *request made if stock is not in array
	 */
    function requestStock(option)
    {
		//selected default is false
        selected = false;

        //check if there are any companies selected
        if(_selected_companies.length != 0)
        {
			//loop through list of selected companies
            for(i = 0; i<_selected_companies.length; i++)
            {
				//if the stock is in the list set selected true
                if(_selected_companies[i].getName() == option)
                {
                    selected = true;
                }
            }
        }

		//if the stock is not in the list
        if(selected == false)
        {
			//request the stock information from the database using AJAX
            url = "../PHP/stocks.php";
			data = "name="+option;
            ajaxRequest(url,"POST", data, createStock);
        }
    }

	/*
	 *Step Two: createStock
     *call back function creates a stockline object using the returned data
	 *The object is added to the selected companies array and calls the displayList function
     */
	function createStock(response)
    {
		_selected_companies.push(new StockLine(response[0],response[1],response[2]));
        displayList();
    }

    /*
	 *Step Three: displayList() -
	 *Note: display list is also called when a sort option has changed
	 *if there are no companies selected do nothing
	 *if there is more than one selected company clear list element
	 *sort the selected company array
	 *add the sorted selected companies to the list element
	 *else there is no need to sort or clear
	 *add the stock to the list element
	 *
    */
    function displayList()
    {
        //if there are companies selected
        if(_selected_companies.length != 0)
        {
            //if there are more than one companies selected
            if(_selected_companies.length > 1)
            {
                //clear existing list
                //sort the list of companies
                //add the now sorted companies to the list
                clearListDisplay();
                sortStocks();
                addtoListDisplay();
            }
            else
            {
                addtoListDisplay();
            }
        }
    }

    //Functions Required for display the stockline objects

	//Removes stockline objects into widget list element
    function clearListDisplay()
    {
        widget.list.innerHTML = "";
    }

    //Adds stockline objects into widget list element
    function addtoListDisplay()
    {
        for(i = 0; i < _selected_companies.length; i++)
        {
            widget.list.appendChild(_selected_companies[i].getDomElement());
        }
    }

    //Decides which sort function to use deppending on the sort value
	//value is default 1 and changed using radio buttons
    function sortStocks() {
        if(_sort == 1)
        {
			_selected_companies.sort(sortByPrice);
        }
        else
        {
            _selected_companies.sort(sortByName);
        }
    }

	//sorts list by name by comparing string values
	//using stockline getter function getName
	var sortByName = function(company1, company2){
		if(company1.getName() > company2.getName())
		{
			//company 1s name is before company 2s
			return 1;
		}
		else if(company1.getName() < company2.getName())
		{
			//company 2s name is before company 1s
			return -1;
		}
		else
		{
			//both campanies are equal in position
			return 0;
		}
	}

	//sorts list by price by comparing float values
	//using stockline getter function
	var sortByPrice = function(company1, company2){
		if(company1.getPrice() > company2.getPrice())
		{
			//company 1 costs more than company 2
			return 1;
		}
		else if(company1.getPrice() < company2.getPrice())
		{
			//company 2 costs more than company 1
			return -1;
		}
		else
		{
			//both campanies are equal in position
			//they are the same price
			return 0;
		}
	}

																				//==========================================================================
	//private method to intialise the widget's UI on start up
	var _initialise = function(container_element){
		_createUI(container_element);
	}

																				//==========================================================================
	//Constructor Function for the inner StockLine object
	var StockLine = function(name, price, movement){

		//declare the data properties for the object and its UI
        //var _container = container;
        var _name = name;
        var _price = price;
        var _movement = movement;

		//declare an inner object literal to represent the widget's UI
        var dom_element = null;

        var line = {
            name_label: null,
            price_label: null,
            movement_label: null
        };


		//function to creates and configurse the DOM elements for the UI
        var _createUI = function(){

			//STOCKLINE MAIN CONTAINER
            dom_element = document.createElement('div');						//create div to hold all elements of the stock line

            //NAME ELEMENT
            line.name_label = document.createElement('span');					//create span to hold name value
            line.name_label.innerHTML = _name + "\t";							//add name text to span
			line.name_label.className = "stockvalue";							//add class for css

			//PRICE ELEMET
            line.price_label = document.createElement('span');					//Samesteps for movement and price
			line.price_label.innerHTML = _price + "\t";
			line.price_label.classname = "stockvalue";

			//MOVEMENT ELEMET
            line.movement_label = document.createElement('span');
			line.movement_label.innerHTML = _movement + "\t";
			line.movement_label.className = "stockvalue";

            //ADD ELEMENTS TO DOM_ELEMENT
			dom_element.appendChild(line.name_label);							//add price to dom_element div
			dom_element.appendChild(line.price_label);							//add price to dom_element div
            dom_element.appendChild(line.movement_label);						//add movementto dom_element div
        }

		//getters for the stockline object
		//returns the div element that contains all the stock information
        this.getDomElement = function() {
            return dom_element;
        }
		//returns the price of the stockline object as a float
        this.getPrice = function() {
            return parseFloat(_price);
        }
		//returns the string that stores the name of the stockline object
        this.getName = function() {
            return _name;
        }
		//_createUI() method is called when the object is instantiated
		_createUI();

  	};
																				//==========================================================================

	//_initialise method is called when a StockWidget object is instantiated
	_initialise(container_element);

}																				//==========================================================================

/* Note:
 * remember to comment clearly so you can use this as a template for a widget when you need to
 * skeleton code originally had the container be passed into stockline try rewrite code and figure out why that is better
 *
 *
 */

