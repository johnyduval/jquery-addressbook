// Set the API base url
var API_URL = "https://loopback-rest-api-demo-ziad-saab.c9.io/api";

// Get a reference to the <div id="app">. This is where we will output our stuff
var $app = $('#app');



// Data retrieval functions
function getAddressBooks(pageNumber) {
    return $.getJSON(API_URL + '/AddressBooks?filter[limit]=5&filter[offset]=' + pageNumber * 5);
}

function getAddressBook(id) {
    return $.getJSON(API_URL + '/AddressBooks/' + id);

}

function getEntries(addressBookId, pageNumber) {
    // TODO... perhaps by using a GET to /AddressBooks/:id/entries :)
    return $.getJSON(API_URL + '/AddressBooks/' + addressBookId + '/entries?filter[limit]=5&filter[offset]=' + pageNumber * 5);
}

function getEntry(entryId, pageNumber) {
    return $.getJSON(API_URL + '/entries/' + entryId);
}

function getPhone(phoneId) {
    return $.getJSON(API_URL + '/entries/' + phoneId + '/phones');
}

function getEmail(emailId) {
    return $.getJSON(API_URL + '/entries/' + emailId + '/emails');
}

function getAddresses(addressesId) {
    return $.getJSON(API_URL + '/entries/' + addressesId + '/addresses');
}

function putEntry(entry) {
    return $.ajax({
        url: API_URL + "/entries/" + entry.id,
        method: "PUT",
        data: entry
    });
}

function putAddress(entry) {
    return $.ajax({
        url: API_URL + "/addresses/" + entry.id,
        method: "PUT",
        data: entry
    });
}

function putPhone(entry) {
    return $.ajax({
        url: API_URL + "/phones/" + entry.id,
        method: "PUT",
        data: entry
    });
}

function putEmail(entry) {
    return $.ajax({
        url: API_URL + "/emails/" + entry.id,
        method: "PUT",
        data: entry
    });
}

// End data retrieval functions




// Functions that display things on the screen (views)

function displayAddressBooksList(pageNumber) {

    getAddressBooks(pageNumber).then(
        function(addressBooks) {

            $app.html(''); // Clear the #app div
            $app.append('<h2>Address Books List</h2>');
            $app.append('<ul>');

            addressBooks.forEach(function(ab) {
                $app.find('ul').append('<li data-id="' + ab.id + '">' + ab.name + '</li>');
            });


            if (addressBooks.length >= 5) {
                if (pageNumber === 0) {
                    $app.append('<button class="next_button">&gt;</button>');

                    $('.next_button').on('click', function() {
                        pageNumber += 1;
                        displayAddressBooksList(pageNumber);
                    });
                }
                else {
                    $app.append('<button class="previous_button">&lt;</button>');
                    $app.append('<button class="next_button">&gt;</button>');

                    $('.next_button').on('click', function() {
                        pageNumber += 1;
                        displayAddressBooksList(pageNumber);
                    });

                    $('.previous_button').on('click', function() {
                        pageNumber -= 1;
                        displayAddressBooksList(pageNumber);
                    });
                }
            }
            else {

                $app.append('<button class="previous_button">&lt;</button>');

                $('.previous_button').on('click', function() {
                    pageNumber -= 1;
                    displayAddressBooksList(pageNumber);
                });

            }

            $app.find('li').on('click', function() {
                var addressBookId = $(this).data('id');
                var addressBookName = $(this).html();
                displayAddressBook(addressBookId, addressBookName, 0);
            });
        });
}



function displayAddressBook(addressBookId, addressBookName, pageNumber) {

    //alert(addressBookId + ": " + addressBookName);
    getEntries(addressBookId, pageNumber).then(
        function(addressBook) {

            $app.html(''); // Clear the #app div
            $app.append('<h2>' + addressBookName + '</h2>');
            $app.append('<button class="back">Back</button>');
            $app.append('<ul>');

            addressBook.forEach(function(entry) {
                $app.find('ul').append('<li data-id="' + entry.id + '">' + entry.firstName + " " + entry.lastName + '</li>');
            });

            $('.back').on('click', function() {
                displayAddressBooksList(0);
            });

            if (addressBook.length >= 5) {
                if (pageNumber === 0) {
                    $app.append('<button class="next_button">&gt;</button>');

                    $('.next_button').on('click', function() {
                        pageNumber = pageNumber + 1;
                        displayAddressBook(pageNumber);
                    });
                }
                else {
                    $app.append('<button class="previous_button">&lt;</button>');
                    $app.append('<button class="next_button">&gt;</button>');

                    $('.next_button').on('click', function() {
                        pageNumber = pageNumber + 1;
                        displayAddressBook(pageNumber);
                    });

                    $('.previous_button').on('click', function() {
                        pageNumber = pageNumber - 1;
                        displayAddressBook(pageNumber);
                    });
                }
            }
            else {
                if (pageNumber === 0) {}
                else {
                    $app.append('<button class="previous_button">&lt;</button>');

                    $('.previous_button').on('click', function() {
                        pageNumber = pageNumber - 1;
                        displayAddressBook(pageNumber);
                    });
                }
            }


            $app.find('li').on('click', function() {
                var entryId = $(this).data('id');
                var entryContent = $(this).html();
                displayEntry(entryId, entryContent, addressBookId, addressBookName);
            });
        }
    );
}

function displayEntry(EntryId, EntryContent, addressBookId, addressBookName) {
    $app.html('');
    $app.append('<button class="back-button">Back</button>');

    $('.back-button').on('click', function() {
        displayAddressBook(addressBookId, addressBookName, 0);
    });

    $app.append('<button class="edit">Edit</button>');

    getEntry(EntryId).then(

        function(entry) {
            $app.append('<h3>Name</h3>');
            $app.append('<ul id="names"></ul>');
            $app.find('#names').append('<li data-id="' + entry.id + '">' + entry.firstName + ' ' + entry.lastName + '<br>' + entry.birthday + '</li>');
        });

    getPhone(EntryId).then(
        function(phoneNumbers) {
            $app.append('<h3>Phone Number(s)</h3>');
            $app.append('<ul id= "phone"></ul>');

            phoneNumbers.forEach(function(phone) {
                $app.find('#phone').append('<li data-id="' + phone.id + '">' + '<b>' + phone.type + '</b>: ' + phone.phoneNumber);

            });

            getEmail(EntryId).then(
                function(emails) {
                    $app.append('<h3>Email(s)</h3>');
                    $app.append('<ul id="email"></ul>');

                    emails.forEach(function(Email) {
                        $app.find('#email').append('<li data-id="' + Email.id + '">' + '<b>' + Email.type + '</b>' + ': ' + Email.email);
                    });

                    getAddresses(EntryId).then(
                        function(addresses) {
                            $app.append('<h3>Address(es)</h3>');
                            $app.append('<ul id="address"></ul>');

                            addresses.forEach(function(Address) {
                                $app.find('#address').append('<li data-id="' + Address.id + '">' + '<h3>' + Address.type + '</h3>' + '<br>' + Address.line1 + '<br>' + Address.line2 + '<br>' + Address.city + ', ' + Address.state + '<br>' + Address.zip + ', ' + Address.country);
                            });

                            $('.edit').on('click', function() {
                                getEntry(EntryId).then(function(entry) {
                                    $app.html('');
                                    $app.append('<h3>Name</h3>');
                                    $app.append('<form id="name_form" ></form>');
                                    $app.find('#name_form').append('<form data-id="' +
                                        entry.id + '">First name:<br><input type="text" name="firstName" id="firstName" value="' +
                                        entry.firstName + '"><br>Last name:<br><input type="text" name="lastname" id="lastName" value="' +
                                        entry.lastName + '"><br><input type="text" name="birthday" id="birthday" value="' +
                                        entry.birthday + '">');
                                    $app.append('<h3>Phone Number(s)</h3>');

                                    getPhone(EntryId).then(function(phones) {
                                        phones.forEach(function(phone) {
                                            $app.append('<form id="phone_form" ></form>');
                                            $app.find('#phone_form').append('<form data-id="' +
                                                phone.id + '">Type:<br><input type="text" name="phoneType" id="phone_type" value="' +
                                                phone.type + '"><br>Phone Number:<br><input type="text" name="phoneNumber" id="phone_number" value="' +
                                                phone.phoneNumber + '">');
                                        });

                                        $app.append('<h3>Email(s)</h3>');

                                        getEmail(EntryId).then(function(emails) {
                                            emails.forEach(function(email) {
                                                $app.append('<form id="email_form" ></form>');
                                                $app.find('#email_form').append('<form data-id="' +
                                                    email.id + '">Type:<br><input type="text" name="phoneType" id="email_type" value="' +
                                                    email.type + '"><br>Email:<br><input type="text" name="phoneNumber" id="email_address" value="' +
                                                    email.address + '">');
                                            });

                                            $app.append('<h3>Address(es)</h3>');

                                            getAddresses(EntryId).then(function(addresses) {
                                                addresses.forEach(function(address) {
                                                    $app.find('#address_form').append('<h4>' + address.type + '</h4>');
                                                    $app.append('<form id="address_form" ></form>');
                                                    $app.find('#address_form').append('<form data-id="' +
                                                        address.id + '">Address 1:<br><input type="text" name="address1" id="address1" value="' +
                                                        address.line1 + '"><br>Address 2:<br><input type="text" name="address2" id="address2" value="' +
                                                        address.line2 + '"><br>City:<br><input type="text" name="city" id="address_city" value="' +
                                                        address.city + '"><br>State:<br><input type="text" name="state" id="address_state" value="' +
                                                        address.state + '"><br>Zip:<br><input type="text" name="zip" id="address_zip" value="' +
                                                        address.zip + '"><br>Country:<br><input type="text" name="country" id="address_country" value="' +
                                                        address.country + '"><br>Type:<br><input id="type" type="text" name="country" id="address_type" value="' +
                                                        address.type + '">');
                                                });

                                                $app.append('<button id="submit">Submit</button>');

                                                $('#submit').on('click', function() {
                                                    
                                                    entry.firstName = $('#firstName').val();
                                                    entry.lastName = $('#lastName').val();
                                                    entry.birthday = $('#birthday').val();
                                                    phones.forEach(function(phone){
                                                        phone.type = $('#phone_type').val();
                                                        phone.phoneNumber = $('#phone_number').val();
                                                        });
                                                    emails.forEach(function(email){
                                                            email.type = $('email_type').val();
                                                            email.address = $('email_address').val();
                                                            });
                                                    addresses.forEach(function(address){
                                                            address.line1 = $('#address1').val();
                                                            address.line2 = $('#address2').val();
                                                            address.city = $('address_city').val();
                                                            address.state = $('address_state').val();
                                                            address.zip = $('address_zip').val();
                                                            address.country = $('address_country').val();
                                                            address.type = $('address_type').val();
                                                            });
                                                    
                                                    putEntry(entry).then(function() {
                                                        putPhone(entry).then(function(){
                                                            putEmail(entry).then(function(){
                                                                putAddress(entry).then(function(addresses){
                                                                    displayEntry(entry.id);
                                                                });
                                                            });
                                                        });
                                                    });
                                                        
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                });
});

};


// End functions that display views





// Start the app by displaying all the addressbooks
// NOTE: This line is very important! So far, our code has only defined functions! This line calls the
// function that displays the list of address books, effectively initializing our UI.
displayAddressBooksList(0);