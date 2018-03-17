$(document).ready(function() {
    var activeSystemClass = $('.list-group-item.active');
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};
    //something is entered in search form
    $('form span button').click( function() {
       var that = $('#system-search');
        if(isAddress($('#system-search').val())){
        // affect all table rows on in systems table
        var tableBody = $('.table-list-search tbody');
        var tableRowsClass = $('.table-list-search tbody tr');
        $('.search-sf').remove();
        tableRowsClass.each( function(i, val) {
        
            //Lower text for case insensitive
            var rowText = $(val).text().toLowerCase();
            var inputText = $(that).val().toLowerCase();
        
          $.ajax({
                    "method": "GET",
                    "url": "https://api.github.com/search/code?q=" + $('#system-search').val() + "+in:file+language:json+repo:FreeSimpleOpenSource/EthereumALLAddress",
                    "headers": {
                        "Accept": "application/vnd.github.v3.text-match+json"
                    },
                    "xhrFields": {
                        "withCredentials": true
                    }
                        }).done(function(data) {
                           var datas  =  data;
              console.log(datas);
              
                              if(inputText != '')
                            {
                                $('.search-query-sf').remove();
                                tableBody.prepend('<tr class="search-query-sf"><td colspan="6"><strong>Searching for: "'
                                    + $(that).val()
                                    + '"</strong></td></tr>');
                            }
                            else
                            {
                                $('.search-query-sf').remove();
                            }

                            if( rowText.indexOf( inputText ) == -1 )
                            {
                                //hide rows
                                tableRowsClass.eq(i).hide();

                            }
                            else
                            {
                                $('.search-sf').remove();
                                tableRowsClass.eq(i).show();
                            }
                         
            });         
            
            
        });
        //all tr elements are hidden
        if(tableRowsClass.children(':visible').length == 0)
        {
            tableBody.append('<tr class="search-sf"><td class="text-muted" colspan="6">No entries found.</td></tr>');
        }
    });
        }
});
