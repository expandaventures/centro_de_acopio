'use strict';
let apiKey = 'e36cab255c6af38416816095fd94dcb94284cefc28b56bb5b11699f4a1cb4497';

function get_data(url, data, cb) {
  data.apiKey = apiKey;
  $.ajax({
    crossDomain:true,
    type: "GET",
    url: url,
    data: data,
    async: true,
    success:function(e) {
      (cb)(e);
    }
  });
}

function post_data(url, data, cb_success, cb_error) {
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey,},
    type: "POST",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function put_data(url, data, cb_success, cb_error) {
  data.apiKey = apiKey;
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey},
    type: "PUT",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function delete_data(url, data, cb_success, cb_error) {
  $.ajax({
    crossDomain:true,
    headers: {'X-Requested-With': apiKey,},
    type: "DELETE",
    url: url,
    data: data,
    dataType: 'json',
    async: true,
    success:function(e) {
      (cb_success)(e);
    },
    error: function(e) {
      (cb_error)(e)
    }
  });
}

function inventory_table(raw_data) {
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
      tr.innerHTML = '<td>' + data[i].location + '</td>'
                    + '<td>' + data[i].product + '</td>'
                    + '<td>' + data[i].quantity + '</td>'
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
      tbody.appendChild(tr);
      document.getElementById('del-'+item_id).addEventListener('click', function(e){
        delete_data('https://api.sintrafico.com/inventory/' + item_id, {}, post_success)
      });
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

function updateProduct() {
  let location = document.getElementById('current-location').value,
      product = document.getElementById('current-product').value,
      quantity = document.getElementById('current-quantity').value,
      item_id = document.getElementById('item-id-modify').value;
  let data = {'product': product, 'location': location, 'quantity': parseInt(quantity)}
  put_data('https://api.sintrafico.com/inventory/'+item_id, data, post_success, post_fail)
}

function post_success(e){
  $('#newProduct').modal('hide')
  $('#modifyProduct').modal('hide')
  let success = document.getElementById('ok-post');
  get_data('https://api.sintrafico.com/inventory', {}, inventory_table)
  success.classList.toggle("hidden");
  setTimeout(function(){ success.classList.toggle("hidden"); }, 2000);
}

function post_fail(e) {
  let keys = Object.keys(e.responseJSON.message)
        .join(', ')
        .replace('product', 'Producto')
        .replace('location', 'Dirección');
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
