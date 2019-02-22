var artResults = (() => {
  // search the collection using a JSON call
  function search(query) {
    return $.getJSON(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=XaEeFrSV&format=json`);
  }

  $(function() {
    fireSearch('artists');
  });

  function fireSearch(entry) {
    
    // fire the search query
    search(entry).done(function (results) {
      $('#result-container').empty();
      var $div = $('#result-container');
      $div.html('');

      if (results.artObjects.length === 0) {
        $div.html('<h2>No results found...</h2>');
      } else {
        // create a button for each art object found
        $.each(results.artObjects, function (index, object) {

          var $btn = $('<button class="thumbnail">' + '</button>').appendTo($div);
          $btn.append(thumbnail(object));
          $btn.append(title(object));

          // make each btn clickable, showing the modal with details
          $btn.on('click', () => {
            showDetails(object);
          });
        });
      }
    });
  }

  let searchBox = $('#query');
  
  //Search by clicking Search btn
  $('#search-btn').click(() => {
    fireSearch(searchBox.val());
  });

  //Search by pressing Enter on keyboard
  $('#query').on('keydown', (e) => {
    if (e.key === 'Enter'){
      fireSearch(searchBox.val());
    }
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
})();

// Function that collects art object details and displays it in a modal
function showDetails(object) {
  (() => {
    var $modalContainer = $('#modal-container');
    var imgEl = $('<img>');
    if (object.webImage !== null) {
      imgEl.attr('src', object.webImage.url.replace("s0", "s600"));
    } else {
      imgEl.attr('id', 'thumb-w-bg');
    };

    function loadDetails(object) {
      var url='http://cors.io/?'+object.links.web
      $.ajax(url, { dataType: 'json' }).then( (details) => {
        // Now we add the details to the art object item
        console.log(details.responseJSON);
                
      }).catch( (e) => {
        console.error(e);
      });
    }

    loadDetails(object);
    
    function showModal() {
      // Clear all existing modal content
      $modalContainer.empty();

      var modal = $('<div>').addClass('modal');
      $modalContainer.append(modal);
      $modalContainer.addClass('is-visible');

      var hyperlink = $('<a>').attr('href', object.links.web).attr('target', '_blank').text('click here');

      //Add new modal content
      modal.append(imgEl)
        .append($('<h3>').text(object.longTitle))
        .append($('<p>').html('Art Object Number: ' + object.objectNumber + '<br>' + 'For more details ').append(hyperlink))
        .append($('<button>').addClass('modal-close').text('Close'));
    };

    function hideModal() {
      $modalContainer.removeClass('is-visible');
    };

    showModal();

    //Close modal by: a) pressing ESC on the keyboard
    $(window).on('keydown', (e) => {
      if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
        hideModal();
      }
    });

    // b) clicking Close button
    $('.modal-close').click(() => {
      hideModal();
    });

    // c) clicking outside the modal
    $modalContainer.click((event) => {
      var target = $(event.target);
      if (target.is($modalContainer)) {
        hideModal();
      }
    });
  })();
}