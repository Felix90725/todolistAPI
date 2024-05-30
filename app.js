const login = document.querySelector(".login_wrap");
const signUp = document.querySelector(".signUp_wrap");
const ChanegSign = document.querySelector("#ChanegSign");
const changeLogin = document.querySelector("#changeLogin");
const todolist = document.querySelector(".todo_wrap");
const nameTodo = document.querySelector("#nameTodo");
const urlApi = "https://todoo.5xcamp.us";
let token = "";
//Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ODA5Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzE2OTU3OTExLCJleHAiOjE3MTgyNTM5MTEsImp0aSI6ImI4NjUwMzA3LWZjZWEtNDE2ZS1hYjBhLTVmZDYzYjM0YWNjNiJ9.vReztf8bJA2QNqY1ZR-sL5sytPekbPVbprN2WQD_-qk

//切換登入註冊介面
ChanegSign.addEventListener("click", changewrap);
changeLogin.addEventListener("click", changewrap);
function changewrap(e) {
  if (e.target.id === "ChanegSign") {
    login.classList.add("none");
    signUp.classList.remove("none");
  } else if (e.target.id === "changeLogin") {
    signUp.classList.add("none");
    login.classList.remove("none");
  }
}

//註冊介面
const signEmail = document.querySelector(".signEmail");
const signName = document.querySelector(".signName");
const signPassword = document.querySelector(".signPassword");
const checkPassword = document.querySelector(".checkPassword");
const signSend = document.querySelector(".send");
signSend.addEventListener("click", callSignUp);

function callSignUp() {
  if (
    signEmail.value === "" ||
    signName.value === "" ||
    signPassword.value == ""
  ) {
    alert("請輸入完整資料!!");
    return;
  } else if (signPassword.value !== checkPassword.value) {
    alert("密碼不一致!!");
    signEmail.value = "";
    signName.value = "";
    signPassword.value = "";
    checkPassword.value = "";
    return;
  }
  axios
    .post(`${urlApi}/users`, {
      user: {
        email: signEmail.value.trim(),
        nickname: signName.value.trim(),
        password: signPassword.value.trim(),
      },
    })
    .then((res) => {
      if (res.data.message === "註冊成功") {
        alert("恭喜帳號註冊成功!!");
        signUp.classList.add("none");
        login.classList.remove("none");
      }
    })
    .catch((error) => {
      if (error.response.data.error == "電子信箱 已被使用") {
        alert("電子信箱已被使用!");
        signEmail.value = "";
        signName.value = "";
        signPassword.value = "";
        checkPassword.value = "";
      } else {
        alert("帳號註冊失敗!");
        signEmail.value = "";
        signName.value = "";
        signPassword.value = "";
        checkPassword.value = "";
      }
    });
}

//登入介面
const loginButton = document.querySelector("#loginButton");
const loginEmail = document.querySelector("#email");
const loginPwd = document.querySelector("#pwd");
loginButton.addEventListener("click", callLogin);

function callLogin() {
  if (loginEmail.value === "" || loginPwd.value === "") {
    alert("請輸入完整資料!!");
    return;
  }
  axios
    .post(`${urlApi}/users/sign_in`, {
      user: {
        email: loginEmail.value,
        password: loginPwd.value,
      },
    })
    .then((res) => {
      if (res.data.message === "登入成功") {
        alert("登入成功");
        loginPwd.value = "";
        token = res.headers.authorization;
        login.classList.add("none");
        todolist.classList.remove("none");
        nameTodo.innerHTML = `<h3 id="nameTodo">${res.data.nickname}的代辦</h3>`;
        getData();
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

//登出
const signOut = document.querySelector("#signOut");
signOut.addEventListener("click", callSignOut);
function callSignOut() {
  axios
    .delete(`${urlApi}/users/sign_out`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      alert(res.data.message);
      login.classList.remove("none");
      todolist.classList.add("none");
    })
    .catch((error) => console.log(error.response));
}

//todolist清單
const todoTxt = document.querySelector(".todoTxt");
const btn_add = document.querySelector(".btn_add");
const list = document.querySelector(".list");
let todoData = [];

//取得遠端資料
function getData() {
  axios
    .get(`${urlApi}/todos`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      todoData = res.data.todos;
      upDateList();
    })
    .catch((error) => console.log(error.response));
}

//渲染
function rander(todoData) {
  let str = "";
  todoData.forEach((item) => {
    str += `<li data-id="${item.id}">
    <label class="checkbox" for="">
      <input type="checkbox"  ${item.check}/>
      <span>${item.content}</span>
    </label>
    <a href="#" class="delete"></a>
  </li>`;
  });
  list.innerHTML = str;
}

//新增功能
btn_add.addEventListener("click", addTodo);
function addTodo() {
  if (todoTxt.value === "") {
    alert("請輸入代辦事項!");
    return;
  }
  axios
    .post(
      `${urlApi}/todos`,
      {
        todo: {
          content: todoTxt.value,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      getData();
      todoTxt.value = "";
    })
    .catch((error) => console.log(error));
}
//清除單筆代辦&切換打勾
list.addEventListener("click", (e) => {
  const id = e.target.closest("li").getAttribute("data-id");
  if (e.target.getAttribute("class") === "delete") {
    callDelete(id);
    e.preventDefault();
  } else {
    callToggle(id);
    e.preventDefault();
  }
});
//清除單筆資料
function callDelete(id) {
  axios
    .delete(`${urlApi}/todos/${id}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((res) => {
      getData();
    })
    .catch((error) => console.log(error));
}
//切換打勾按鈕
function callToggle(id) {
  axios
    .patch(
      `${urlApi}/todos/${id}/toggle`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((res) => {
      getData();
    })
    .catch((error) => console.log(error));
}

//切換 tab
const tab = document.querySelector(".tab");
let toggleStatus = "all";
tab.addEventListener("click", (e) => {
  toggleStatus = e.target.getAttribute("data-tab");
  let tabs = document.querySelectorAll(".tab li");
  tabs.forEach((item) => {
    item.classList.remove("active");
  });
  e.target.classList.add("active");
  upDateList();
});

function upDateList() {
  let showData = [];
  //讓按鈕打勾
  todoData.forEach((item) => {
    if (item.completed_at === null) {
      item.check = "";
    } else {
      item.check = "checked";
    }
  });

  //切換完成狀態
  if (toggleStatus === "all") {
    showData = todoData;
  } else if (toggleStatus === "work") {
    showData = todoData.filter((item) => item.check === "");
  } else {
    showData = todoData.filter((item) => item.check === "checked");
  }
  rander(showData);

  //更改左下方待完成項目
  const workNum = document.querySelector(".workNum");
  workNum.innerHTML = todoData.filter((item) => item.check === "").length;
}

//清除已完成項目
const doneDelete = document.querySelector(".doneDelete");
doneDelete.addEventListener("click", (e) => {
  todoData.forEach((item) => {
    if (item.check === "checked") {
      callDelete(item.id);
    }
  });
});

//優化送出按鈕
todoTxt.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});
