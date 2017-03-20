jQuery(document).ready(function($) {
	var Animal1 = new Animal("1", $("#animal1"));
	var Animal2 = new Animal("2", $("#animal2"));
	var Animal3 = new Animal("3", $("#animal3"));

	$('#newAnimalForm').submit(function(e){
		CreateNewAnimal();
		 e.preventDefault();
	});


})


function CreateNewAnimal()
{
	var postURL = "https://animalrestapi.azurewebsites.net/Animal/Create?candidateID=6d659535-014d-43ce-92b7-c6e960fbb571";
 	
 	var formData = {
            'commonName'        : $('input[name=commonName]').val(),
            'scientificName'    : $('input[name=scientificName]').val(),
            'family'    		: $('input[name=family]').val(),
            'imageURL'			: $('input[name=imageURL]').val()
        };

   $.ajax({url: postURL, method: 'POST', data: formData, dataType:'json', headers:{'Content-Type':'application/x-www-form-urlencoded'}
	})
	 .done(function(formData) {
	 	new NewAnimal(formData.id, $("#viewNewAnimal"))
 
 	});


}


class Animal {
	constructor(id, animalDiv){
		this.id = id;
		this.animalDiv = animalDiv;
		this.getInfo();
	}

	getInfo(){

		var animal = this;
		var queryURL = "https://animalrestapi.azurewebsites.net/Animal/Id/" + this.id + "?candidateID=6d659535-014d-43ce-92b7-c6e960fbb571";

			$.ajax({
				url: queryURL, 
				method: 'GET', 
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
			}).done(function(response){animal.gotInfo(response);});
	}

	gotInfo(response)
	{
				this.commonName = response.animal.commonName;
			 	this.scientificName = response.animal.scientificName;
			 	this.family = response.animal.family;
			 	this.imageURL = response.animal.imageURL
			 	this.display();
	}

	display()
	{
		this.newDiv = $("<div>")
	 	var animalview = $("<img>");
     	animalview.attr('src', this.imageURL);
     	this.newDiv.append(animalview);

	 	var cnview = $("<p>");
	 	var snview = $("<p>");
	 	var famview = $("<p>")
	 	cnview.text("Common Name: " + this.commonName)
	 	snview.text("Scientific Name: " + this.scientificName)
	 	famview.text("Family: " + this.family)
	 	this.newDiv.append(cnview);
	 	this.newDiv.append(snview);
	 	this.newDiv.append(famview)
	 	this.animalDiv.append(this.newDiv)		 	
	}


}


class NewAnimal extends Animal{

	display ()
	{
		super.display();
		var deleteBtn = $("<button>");
	 	deleteBtn.text("Delete Animal");
	 	deleteBtn.attr('class', 'deleteAnimal btn btn-default')

	 	var animal = this;
	 	deleteBtn.click(function(response){animal.delete();});

	 	this.newDiv.append(deleteBtn)
	}

	clearDiv (newDiv)
	{
    newDiv.newDiv.html("");

	}

	delete()
	{
		var postURL = "https://animalrestapi.azurewebsites.net/Animal/Delete?candidateID=6d659535-014d-43ce-92b7-c6e960fbb571";
		var animalDiv = {'animalDiv' : this.animalDiv}
		var newDiv = {'newDiv' : this.newDiv}

		var animal = this;
 		$.ajax({
 			url: postURL, 
 			method: 'POST', 
 			data:  {'id' : this.id}, 
 			dataType:'json', 
 			headers:{'Content-Type':'application/x-www-form-urlencoded'}
 		})
 	 		.done(function() {
 	 		console.log("animal deleted")
 	 		animal.newDiv = newDiv
 	 		animal.clearDiv(newDiv)
 	 
  	});
 		 //e.preventDefault();
	}

}