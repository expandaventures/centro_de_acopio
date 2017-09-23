'use strict';
let apiKey = 'e36cab255c6af38416816095fd94dcb94284cefc28b56bb5b11699f4a1cb4497';

function get_data(url, data, cb, read_only) {
  data.apiKey = apiKey;
  $.ajax({
    crossDomain:true,
    type: "GET",
    url: url,
    data: data,
    async: true,
    success:function(e) {
      (cb)(e, read_only);
    }
  });
}

function post_data(url, data, cb_success, cb_error, type) {
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey,},
    type: "POST",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e, type);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function put_data(url, data, cb_success, cb_error, type) {
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey},
    type: "PUT",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e, type);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function delete_data(url, data, cb_success, cb_error, type) {
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey,},
    type: "DELETE",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e, type);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function inventory_table(raw_data, read_only) {
  let tbody = document.getElementById('inventory-info');
  $('#modifyProduct').on('show.bs.modal', function (e) {
    let button = $(e.relatedTarget);
    let item_id = button.data('id');
    document.getElementById('item-id-modify').value = item_id;
    let row_data = document.getElementById(item_id).cells;
    document.getElementById('current-location').value = row_data[0].innerHTML;
    document.getElementById('current-product').value = row_data[1].innerHTML;
    document.getElementById('current-quantity').value = row_data[2].innerHTML;
  });
  if (raw_data.status = 'OK') {
    tbody.innerHTML = '';
    let data = raw_data.inventory;
    for (let i = 0; i < data.length; i++) {
      let tr = document.createElement('tr');
      let item_id = data[i].item;
      tr.id = item_id;
      let ts = (new Date(data[i].created_at+'Z')).toLocaleString();
      if (read_only){
        tr.innerHTML = '<td>' + data[i].location + '</td>'
                    + '<td>' + data[i].product + '</td>'
                    + '<td>' + data[i].quantity + '</td>'
                    + '<td>' + ts + '</td>'
                    + '<td></td><td></td>'
      } else {
        tr.innerHTML = '<td>' + data[i].location + '</td>'
                    + '<td>' + data[i].product + '</td>'
                    + '<td>' + data[i].quantity + '</td>'
                    + '<td>' + ts + '</td>'
                    + '<td>'
                      + '<button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#modifyProduct" data-id="'+item_id+'">'
                        + '<span class="glyphicon glyphicon-pencil" ></span>'
                      +'</button>'
                    + '</td>'
                    + '<td>'
                      + '<button type="button" class="btn btn-danger btn-xs" id="del-'+item_id+'">'
                        +'<span class="glyphicon glyphicon-remove" ></span>'
                      +'</button>'
                    + '</td>'
      }
      tbody.appendChild(tr);
      //document.getElementById('del-'+item_id).addEventListener('click', function(e){
      //  delete_data('https://api.sintrafico.com/inventory/' + item_id, {}, post_success)
      //});
    }
  }
}

function invoice_table(raw_data, read_only) {
  let tbody = document.getElementById('inventory-info');
  $('#modifyInvoice').on('show.bs.modal', function (e) {
    let button = $(e.relatedTarget);
    let item_id = button.data('id');
    document.getElementById('item-id-modify').value = item_id;
    let row_data = document.getElementById(item_id).cells;
    document.getElementById('current-location').value = row_data[0].innerHTML;
    document.getElementById('current-product').value = row_data[1].innerHTML;
    document.getElementById('current-quantity').value = row_data[2].innerHTML;
  });
  if (raw_data.status = 'OK') {
    tbody.innerHTML = '';
    let data = raw_data.invoice;
    for (let i = 0; i < data.length; i++) {
      let tr = document.createElement('tr');
      let item_id = data[i].invoice;
      tr.id = item_id;
      let ts = (new Date(data[i].created_at+'Z')).toLocaleString();
      let verified = data[i].verified
            ?'<span class="glyphicon glyphicon-ok-circle v-true" ></span>'
            :'<span class="glyphicon glyphicon-remove-circle v-false" ></span>'
      if (read_only){
        tr.innerHTML = '<td>' + data[i].location + '</td>'
                    + '<td>' + data[i].product + '</td>'
                    + '<td>' + data[i].quantity + '</td>'
                    + '<td>' + verified + '</td>'
                    + '<td>' + data[i].warehouse + '</td>'
                    + '<td>' + ts + '</td>'
                    + '<td></td>'
                    + '<td></td>'
      } else {
        tr.innerHTML = '<td>' + data[i].location + '</td>'
                    + '<td>' + data[i].product + '</td>'
                    + '<td>' + data[i].quantity + '</td>'
                    + '<td>' + verified + '</td>'
                    + '<td>' + data[i].warehouse + '</td>'
                    + '<td>' + ts + '</td>'
                    + '<td>'
                      + '<button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#modifyInvoice" data-id="'+item_id+'">'
                        + '<span class="glyphicon glyphicon-pencil" ></span>'
                      +'</button>'
                    + '</td>'
                    + '<td>'
                      + '<button type="button" class="btn btn-danger btn-xs" id="del-'+item_id+'">'
                        +'<span class="glyphicon glyphicon-remove" ></span>'
                      +'</button>'
                    + '</td>'
      }
      tbody.appendChild(tr);
      //document.getElementById('del-'+item_id).addEventListener('click', function(e){
      //  delete_data('https://api.sintrafico.com/invoice/' + item_id, {}, post_success, post_fail, 'invoice')
      //});
    }
  }
}

function saveProduct() {
  let location = document.getElementById('location').value,
      product = document.getElementById('product').value,
      quantity = document.getElementById('quantity').value;
  let data = {'product': product, 'location': location, 'quantity': parseInt(quantity)}
  post_data('https://api.sintrafico.com/inventory', data, post_success, post_fail)
}

function saveInvoice() {
  let location = document.getElementById('location').value,
      product = document.getElementById('product').value,
      quantity = document.getElementById('quantity').value;
  let data = {'product': product, 'location': location, 'quantity': parseInt(quantity), 'warehouse': 'No asignado'}
  post_data('https://api.sintrafico.com/invoice', data, post_success, post_fail, 'invoice' )
}

function updateProduct() {
  let location = document.getElementById('current-location').value,
      product = document.getElementById('current-product').value,
      quantity = document.getElementById('current-quantity').value,
      item_id = document.getElementById('item-id-modify').value;
  let data = {'product': product, 'location': location, 'quantity': parseInt(quantity)}
  put_data('https://api.sintrafico.com/inventory/'+item_id, data, post_success, post_fail)
}

function updateInvoices() {
  let location = document.getElementById('current-location').value,
      product = document.getElementById('current-product').value,
      quantity = document.getElementById('current-quantity').value,
      verified = document.getElementById('current-verified').checked,
      warehouse = document.getElementById('current-warehouse').value,
      item_id = document.getElementById('item-id-modify').value;
  let data = {'product': product, 'location': location, 'quantity': parseInt(quantity), 'warehouse': warehouse}
  if (verified) {
    data.verified = true;
  }
  if (warehouse) {
      put_data('https://api.sintrafico.com/invoice/'+item_id, data, post_success, post_fail, 'invoice')
  } else {
    let error = document.getElementById('error-put');
    let default_html = error.innerHTML;
    error.classList.toggle("hidden");
    error.innerHTML += 'Faltan los datos de Centro de Acopio';
    setTimeout(function(){
      error.classList.toggle("hidden");
      error.innerHTML = default_html;
    }, 3000);
  }
}

function post_success(e, type){
  let url = '', cb;
  if (type != 'invoice') {
    $('#newProduct').modal('hide')
    $('#modifyProduct').modal('hide')
    url = 'https://api.sintrafico.com/inventory';
    cb = inventory_table;
  } else {
    $('#newInvoice').modal('hide')
    $('#modifyInvoice').modal('hide')
    url = 'https://api.sintrafico.com/invoice';
    cb = invoice_table;
  }
  get_data(url, {}, cb)

  let success = document.getElementById('ok-post');
  success.classList.toggle("hidden");
  setTimeout(function(){ success.classList.toggle("hidden"); }, 2000);
}

function post_fail(e) {
  let keys = Object.keys(e.responseJSON.message)
        .join(', ')
        .replace('product', 'Producto')
        .replace('location', 'Ubicación');
  let error = document.getElementById('error-post');
  let default_html = error.innerHTML;
  error.classList.toggle("hidden");
  error.innerHTML += 'Faltan los datos de ' + keys;
  setTimeout(function(){
    error.classList.toggle("hidden");
    error.innerHTML = default_html;
  }, 3000);
}

function searchTable() {
  // Declare variables
  var input, filter, table, tr, td, cell;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
      for (let j = 0; j < td.length; j++) {
        cell = td[j]
        if (cell) {
          if (cell.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            break;
          } else {
            tr[i].style.display = "none";
          }
        }
      }

  }
}


function create_location_autocomplete(class_name) {
  // $('.'+class_name).typeahead();
  $.get("http://api.sintrafico.com/inventory/location?apiKey="+apiKey, function(data){
    $('.'+class_name).typeahead({ source:data.location });
  },'json');
}

function create_product_autocomplete(class_name) {
  // $('.'+class_name).typeahead();
  $.get("http://api.sintrafico.com/inventory/product?key="+apiKey, function(data){
    $('.'+class_name).typeahead({ source:data.product });
  },'json');
}
