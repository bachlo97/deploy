import { BASE_URL } from "./const.js";
import { elt } from "./utils.js";
import { Validator } from "./validator.js";
//Lấy list các input form element
let listEle = document.querySelectorAll(
  ".modal-body input.form-control:not([disabled]),.modal-body select.dropdown,.modal-body textarea.form-control,.form-control#name"
);
let touches = {};
let errors = {};
let mapper = {
  name: 'tb-name',
  type: 'tb-type',
  img: 'tb-img',
  price: 'tb-price',
  desc: 'tb-desc',
}
console.log("listEle", listEle);

//Hàm gọi modal popup: Them San pham or Sua thong tin sanpham
const goiModal = (modal_title, disabled = false, type = 1) => {
  //type 1: them nhan vien, type 2: sua thong tin nhan vien
  document.querySelector(".modal-title").innerHTML = modal_title;
  document.getElementById("name").disabled = disabled;

  switch (type) {
    case 1: //Them San Pham
      document.getElementById("btn-them").style.display = "block";
      document.getElementById("btn-update").style.display = "none";
      break;
    case 2: //sua thong tin San Pham
      document.getElementById("btn-them").style.display = "none";
      document.getElementById("btn-update").style.display = "block";
  }
};

//Gọi modal them sanPham
document.querySelector(".btn-themSP").addEventListener("click", () => {
  goiModal("Thêm món");
});


const renderTable = (products) => {
  const tbody = document.getElementById("tbody");

  // Reset lại tbody trước khi render product
  tbody.innerHTML = "";

  products.forEach((product, index) => {
    const tr = elt(
      "tr",
      undefined,
      elt("td", { class: "column1" }, index + 1),
      elt("td", { class: "column2" }, product.name),
      elt(
        "td",
        { class: "column3" },
        elt("img", { src: product.img })
      ),
      elt("td", { class: "column4" }, `${product.price}$`),
      elt("td", { class: "column5" }, product.desc),
      elt(
        "td",
        { class: "column6" },
        elt(
          "button",
          {
            class: "btn-edit",
            "data-bs-toggle": "modal",
            "data-bs-target": "#exampleModal",
            onclick: () => {
              const modal = document.getElementById("exampleModal");
              goiModal("Chỉnh sửa món ăn", true, 2);
              modal.setAttribute("data-product-id", product.id);
              listEle.forEach((ele) => {
                ele.value = product[ele.id]
              })
            },
          },
          "Edit"
        ),
        elt(
          "button",
          {
            class: "btn-delete",
            onclick: () => {
              deleteProduct(product.id);
            },
          },
          "Delete"
        )
      )
    );

    tbody.append(tr);
  });
};

//Hiện danh sách món
const renderProducts = () => {
  axios({
    url: `${BASE_URL}/fandb`,
    method: "GET",
  }).then((res) => {
    const productList = res.data;
    renderTable(productList);
    document.querySelector('.fa-arrow-up').style.display = 'none';
    document.querySelector('.fa-arrow-down').style.display = 'none'
  });
};

// handle click add button or edit button
const handleClickModal = (idBtn, method) => {
  document.getElementById(idBtn).addEventListener("click", () => {
    //   Chuyển đổi NodeList thành mảng(Array.from(Nodelist))
    const result = Array.from(listEle).map((ele) => {
      return ele.value;
    });
    //   console.log(result)
    const [name, type, img, price, desc] = result;
    let url = `${BASE_URL}/fandb`
    if (method === 'PUT') {
      const modal = document.getElementById("exampleModal");
      url = `${BASE_URL}/fandb/${modal.dataset.productId}`
      if (!Object.values(errors).every(item => item.length === 0)) return;
    } else {
      if (!isValid()) {
        renderErrors();
        return;
      }
    }
    axios({

      url: url,
      method: method,
      data: { name, type, img, price, desc },
    })
      .then((res) => {
        console.log(res);
        renderProducts();
      })
      .finally(() => {
        document.getElementById("btn-close").click();
        Swal.fire({
          position: "top-start",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      });
  });
}
//Thêm món
handleClickModal('btn-them', 'POST')
//Chỉnh sửa món 
handleClickModal('btn-update', 'PUT')


//Xoá món
const deleteProduct = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });

  document.querySelector(".swal2-confirm").onclick = () => {
    axios({
      url: `${BASE_URL}/fandb/${id}`,
      method: "DELETE",
    })
      .then((res) => {
        console.log(res);
        renderProducts();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      });
  };
};

//sắp xếp món theo giá tiền
document.getElementById('sx-tang').onclick = () => {
  axios({
    url: `${BASE_URL}/fandb`,
    method: "GET",
  }).then((res) => {
    console.log(res.data)
    const productList = res.data.sort((a, b) => { return a.price - b.price })
    renderTable(productList);
    document.querySelector('.fa-arrow-up').style.display = 'inline';
    document.querySelector('.fa-arrow-down').style.display = 'none'
  });
}

document.getElementById('sx-giam').onclick = () => {
  axios({
    url: `${BASE_URL}/fandb`,
    method: "GET",
  }).then((res) => {
    console.log(res.data)
    const productList = res.data.sort((a, b) => { return b.price - a.price })
    renderTable(productList);
    document.querySelector('.fa-arrow-up').style.display = 'none';
    document.querySelector('.fa-arrow-down').style.display = 'inline'
  });
}

// ngăn chặn reload lại trang, hành vi mặc định của thẻ form
document.querySelector(".input_search form").onsubmit = function (event) {
  event.preventDefault();
}

// Tìm kiếm món theo tên
document.getElementById('search').addEventListener('keyup', () => {
  let tuKhoa = document.getElementById('search').value.trim().toUpperCase();
  console.log(tuKhoa)
  axios({
    url: `${BASE_URL}/fandb`,
    method: "GET",
  })
    .then((res) => {
      const productList = res.data
      const newProductList = []
      for (let item of productList) {
        let itemName = item.name.trim().toUpperCase();
        if (itemName.search(tuKhoa) !== -1) {
          newProductList.push(item)
        }
      }
      renderTable(newProductList)
      document.querySelector('.fa-arrow-up').style.display = 'none';
      document.querySelector('.fa-arrow-down').style.display = 'none'
    })
})

renderProducts();

//Validate
let validationMapper = {
  name: (value) => new Validator(value).require().checkName1().checkName2().checkName3().getMessage(),
  type: (value) => new Validator(value).require().getMessage(),
  img: (value) => new Validator(value).require().checkImageURL().getMessage(),
  price: (value) => new Validator(value).require(). checkPrice().max(200).getMessage(),
  desc: (value) => new Validator(value).require().checkDesc().getMessage(),
}

const setTouches = (value) => {
  listEle.forEach((ele) => (touches[ele.id] = value));
}

const handleValidate = (event) => {
  const id = event.target.id;
  const value = event.target.value;
  errors[id] = validationMapper[id](value);
}

const renderErrors = () => {
  listEle.forEach(function (ele) {
    let thuocTinh = ele.id;
    let isShow = errors[thuocTinh] != undefined && touches[thuocTinh];

    if (!isShow) {
      // Dừng chạy hàm, không show message
      return;
    }
    document.getElementById(mapper[thuocTinh]).innerHTML = errors[thuocTinh];
    // document.getElementById(mapper[thuocTinh]).style.display = "block";
  });
}

const deleteErrors = () => {
  // Xóa tất cả các lỗi
Object.keys(errors).forEach(key => delete errors[key]);

// Thiết lập lại các phần tử HTML
const countEle = document.querySelector('.count');
const descEle = document.getElementById('desc');

// Loại bỏ lớp 'limit-exceeded' nếu có
if (countEle?.classList.contains('limit-exceeded')) countEle.classList.remove('limit-exceeded');

// Cài đặt lại các thuộc tính
countEle.style.color = 'black';
document.getElementById('wordCount').innerHTML = '0';
// Loại bỏ lớp 'limit-exceeded' của phần tử 'descEle' nếu có
if (descEle?.classList.contains('limit-exceeded')) descEle.classList.remove('limit-exceeded');
}

//* reset form when close modal by  click close button or click outside modal
let buttonGroup = document.querySelectorAll("#iclose,#btn-close,#exampleModal");
buttonGroup.forEach((ele) => {
  ele.onclick = () => {
    setTimeout(function () {
      if (document.getElementById('exampleModal').style.display == 'none') {
        listEle.forEach((ele) => {
          document.getElementById(mapper[ele.id]).innerHTML = "";
          ele.value = "";
        });
        deleteErrors();
      };
    }, 500);
  }
});

const handleBlur = (event) => {
  // event.target: chính là ô input của chúng ta.
  touches[event.target.id] = true; // true: đã từng đi qua ô input

  console.dir(touches);
  // Validate sau khi blur
  handleValidate(event);
  // Hiện errors mỗi khi người dùng blur khỏi ô input
  renderErrors();
}

listEle.forEach(function (ele) {
  ele.onblur = handleBlur;
});

const isValid = () => {
  // TH1: Nếu chưa nhập gì hết mà đã nhấn submit
  if (Object.values(errors).length !== listEle.length) {
    // set tất cả về true
    setTouches(true);
    // Lặp qua để set lại message lỗi của mỗi ô input
    listEle.forEach((ele) => {
      handleValidate({
        target: {
          id: ele.id,
          value: ele.value,
        },
      });
    });
    return false;
  }
  // TH2: Đã nhập đầy đủ
  // 1. Tất cả cả ô input đã từng đi qua
  let isTouch = Object.values(touches).every(function (item) {
    return item;
  });

  // 2. Không được có message lỗi
  let isMessage = Object.values(errors).every(function (item) {
    return item.length === 0;
  });
  return isTouch && isMessage;
}


document.getElementById('desc').addEventListener('input', () => {
  let text = document.getElementById("desc").value.trim();
  // Tách các từ bằng khoảng trắng và đếm số từ
  let words = text.split(/\s+/);
  var wordCount = words.length;
  // Cập nhật số từ trên giao diện\
  if(words[0] === ''){
    wordCount = 0 
  }else{
    if(wordCount >30){
      document.querySelector('.count').style.color = 'red'
      document.querySelector('.desc').classList.add("limit-exceeded")
    }else{
      document.querySelector('.count').style.color = 'black'
      document.querySelector('.desc').classList.remove("limit-exceeded");
    }
  }
 
  document.getElementById("wordCount").innerText = wordCount;
})
