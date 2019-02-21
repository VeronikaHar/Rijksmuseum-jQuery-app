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

        // make each btn clickable, showing the modal with details
        $btn.on('click', () => {
          showDetails(object);
        }); 
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

  // Function that collects art object details
  function showDetails(object) {
    (() => {
      var $modalContainer = $('#modal-container');

      function showModal(title, text) {
        // Clear all existing modal content
        $modalContainer.empty();

        var modal = $('<div>').addClass('modal');
        $modalContainer.append(modal);
        $modalContainer.addClass('is-visible');

        //Add new modal content
        modal.append($('<img>').attr('src', object.webImage.url.replace("s0", "s600")))
        .append($('<h3>').text(title))
        .append($('<p>').text(text))
        .append($('<button>').addClass('modal-close').text('Close'));

        $('<button class="modal-close">').on('click', () => {
          hideModal;
        });
      }

      function hideModal() {
        $modalContainer.removeClass('is-visible');
      }

     // loadDetails(object).then(() => {
        var objectName=object.longTitle;
        var hyperlink=$('<a>').attr('href', object.links.web).text('click here') ; /* this doesn't work either  $('<a href="'+object.links.web+'">click here</a>')*/
        var objectDetails = 'Object Number: ' + object.objectNumber
        +'\nFor more details '+ hyperlink +'.' ;
        showModal(objectName, objectDetails);
      //});

      //Close modal by pressing ESC on the keyboard
      window.on('keydown', (e) => {
        if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
          hideModal();
        }
      });

      $modalContainer.on('click', (e) => {
        var target = e.target;
        if (target === $modalContainer) {
          hideModal();
        }
      });
    })();
  }