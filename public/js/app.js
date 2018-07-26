
function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      console.log("Results from getFiles()", res);
      return res;
    })
    .fail(err => {
      console.error("Error in getFiles()", err);
      throw err;
    });
}

function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

function handleAddFileClick() {
  setForm({});
  toggleAddFileFormVisibility();
}

function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('d-none');
  $('#lensDetails').modal('toggle')
}

function submitFileForm() {
  console.log("You clicked 'submit'. Congratulations.");

  const fileData = {
    description: $('#file-description').val(),
    rating: $('#file-rating').val(),
    _id: $('#file-id').val(),
  };

  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("We have posted the data");
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log("Failures at posting, we are", error);
    })

  console.log("Your file data", fileData);
}

function cancelFileForm() {
  toggleAddFileFormVisibility();
}

function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setForm(file);
    toggleAddFileFormVisibility();
  }
}


function setForm(data) {
  data = data || {};

  const file = {
    description: data.description || '',
    rating: data.rating || '',
    _id: data._id || '',
  };

  $('#file-description').val(file.description);
  $('#file-rating').val(file.rating);
  $('#file-id').val(file._id);

}


function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}

function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      console.log("File", id, "is DOOMED!!!!!!");
      refreshFileList();
    })
    .fail(function(error) {
      console.log("I'm not dead yet!", error);
    })
}


refreshFileList();