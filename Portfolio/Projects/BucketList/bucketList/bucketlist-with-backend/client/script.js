$(document).ready(function(){

    const baseURL = 'http://localhost:3000'

    //fetch to read doute on server as document is finished loading
    fetch(`${baseURL}/api/bucket`)
    .then(response => response.json())  //once we get a response aka some JSON lets parse it
    .then(data => {
        console.log(data)
        //once we are successful in getting the data from the backend, we will be able to get rid of the placeholder lis
        $('ul').empty()     //clears the lis

        //iterate over our array of objects - create lis and append them to our ul

        data.forEach(item => {
            let completedClass = item.isComplete ? "completed" : ""
            $('ul').append(`
                <li data-id="${item.id}" class="${completedClass}">
                ${item.description}
                <span><i class="fa-solid fa-trash"></i></span></li>
                <li>
            `)
        })

    })
    .catch(error => console.log(`Something went wrong retrieving data`))


    //crUd
    $('ul').on('click', 'li', function(){
        let id = $(this).data('id')
        fetch(`${baseURL}/api/bucket/${id}`, {
            method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
        })
        .then(response => response.json())
        .then(data => {
            $(this).toggleClass('completed')
        })
        .catch(error => console.log("Error updating item: ", error))
    })





    //cruD
    $("ul").on("click", "span", function(event) {


        //when clicking, you click on everything, think wallbang
        event.stopPropagation();    //this prevents clicking on multiple things



        let id = $(this).parent().data('id')
        fetch(`${baseURL}/api/bucket/${id}`, {          //sometimes doesnt work with " + "
            method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
        })
        .then(response => response.json())
        .then(data => {
            $(this).parent().remove()
        })
        .catch(error => console.log("Error deleting item: ", error))
    })





    //Crud
    $("input").keypress(function(event) {
        if(event.which === 13) {      //if user presses 13(enter)
            var listItem = $(this).val().trim();                            //grab value of input


            fetch(`${baseURL}/api/bucket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({description: listItem})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                $("ul").append(`<li data-id="${data.id}">${listItem} <span><i class="fa-solid fa-trash"></i></span></li>`)
                $(this).val("")
            })
            .catch(error => console.log("Something went wrong trying to add item", error))
        }
        
    })








//if want challenge
//button, only 30 characters, both button and enter works


})