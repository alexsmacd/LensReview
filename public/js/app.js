
function getLens() {
  return $.ajax('/api/lens')
    .then(res => {
      console.log("Results from getLens()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getLens()", err);
      throw err;
    });
}

function refreshLensList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getLens()
    .then(lens => {

      window.lensList = lens;

      const data = {lens: lens};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

function handleAddLensClick() {
  setForm({});
  toggleAddLensFormVisibility();
}

function toggleAddLensFormVisibility() {
  $('#form-container').toggleClass('d-none');
  $('#lensDetails').modal('toggle')
}

function submitLensForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const lensData = {
    description: $('#file-description').val(),
    rating: $('#file-rating').val(),
    _id: $('#file-id').val(),
  };

  let method, url;
  if (lensData._id) {
    method = 'PUT';
    url = '/api/lens/' + lensData._id;
  } else {
    method = 'POST';
    url = '/api/lens';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(lensData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshLensList();
      toggleAddLensFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your lens data", lensData);
}

function cancelLensForm() {
  toggleAddLensLensVisibility();
}

function handleEditLensClick(id) {
  const lens = window.lensList.find(lens => lens._id === id);
  if (lens) {
    setForm(lens);
    toggleAddLensFormVisibility();
  }
}


function setForm(data) {
  data = data || {};

  const lens = {
    description: data.description || '',
    rating: data.rating || '',
    _id: data._id || '',
  };

  $('#file-description').val(lens.description);
  $('#file-rating').val(lens.rating);
  $('#file-id').val(lens._id);

}


function handleDeleteLensClick(id) {
  if (confirm("Are you sure?")) {
    deleteLens(id);
  }
}

function deleteLens(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/lens/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("Lens", id, "is DOOMED!!!!!!");
      refreshLensList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}


refreshLensList();
