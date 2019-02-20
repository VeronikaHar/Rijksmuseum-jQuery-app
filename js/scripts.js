      // search the collection using a JSON call
      function search(query) {
        return $.getJSON(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=XaEeFrSV&format=json`);
      }
      
      let searchBox = $('#query');
      $("#search-btn").click(() => {
        // fire the search query
        search(searchBox.val()).done(function (results) {
          $('#result-container').empty();
          var $div = $('#result-container');
          $div.html('');
          
          // create a button for each art object found
          $.each(results.artObjects, function (index, object) {
            console.log(object);
            
            var $btn = $('<button class="thumbnail">' + '</button>').appendTo($div);
            $btn.append(thumbnail(object));
            $btn.append(title(object));
            
            // make each row clickable, navigating to the relevant page on the Rijksmuseum website
            /* $btn.on("click", function() {
              document.location = object.links.web;
            }); */
          })
        });
      });
      
      // creates a thumbnail image for the specified art object
      function thumbnail(object) {
        if (object.webImage !== null) {
          return $('<div>').addClass('thumb').css('background-image', 'url(' +
          object.webImage.url.replace("s0", "s350") + ')');
        } else {
          return $('<div>').addClass('thumb').attr('id', 'thumb-w-bg')
        };
      }
      
      // creates title and author info for the specified art object
      function title(object) {
        return $('<div class="title">' + '<span>' + object.title + '</span>' + '<br>' +
        'by ' + '<br>' + object.principalOrFirstMaker + '</div>');
      }