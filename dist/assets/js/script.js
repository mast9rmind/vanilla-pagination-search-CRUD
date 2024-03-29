const BASE_URL = "https://62a21c77cc8c0118ef5d2e28.mockapi.io/users";
let timeoutId;
let page = 1;

let idToDelete = -1;

const init = async () => {
	const data = await getUsers(BASE_URL, page);
	tableRender(data, page);
};

const tableRender = async (data, page = 1) => {
	const tbody = document.getElementById("tbody");
	tbody.innerHTML = "";

	console.log(data);

	data.forEach((userObj, index) => {
		const tr = tbody.insertRow();
		tr.setAttribute("data-id", userObj.id);

		const {
			id,
			name,
			family,
			birthday,
			nationalID,
			fatherName,
			education,
			job,
			gender,
			country,
			state,
			city,
			street,
			block,
			no,
			floor,
			unit,
		} = userObj;

		const modifiedUserObj = [
			id,
			name,
			family,
			birthday,
			nationalID,
			fatherName,
			education,
			job,
			gender,
			country,
			state,
			city,
			street,
			block,
			no,
			floor,
			unit,
		];

		modifiedUserObj.forEach((objValue) => {
			const td = tr.insertCell();
			td.innerHTML = objValue;
		});

		const editCell = tr.insertCell();
		const editImg = document.createElement("img");
		editImg.classList.add("icon");
		editImg.src = "./assets/icons/edit.svg";
		editCell.appendChild(editImg);
		editImg.onclick = () => {
			window.open(`./add-edit.html?status=edit&id=${id}`, "_self");
		};
		const deleteCell = tr.insertCell();
		const deleteImg = document.createElement("img");
		deleteImg.classList.add("icon");
		deleteImg.src = "./assets/icons/delete.svg";
		deleteCell.appendChild(deleteImg);

		deleteImg.onclick = () => {
			idToDelete = id;
			const modal = document.querySelector(".modal");
			modal.style.display = "initial";
			let inputs = modal.getElementsByTagName("input");

			[...inputs].forEach((input, index) => {
				input.value = modifiedUserObj[index + 1];
			});
		};
	});
};

init();

const tablePagination = () => {};

function addRow() {
	window.open(`./add-edit.html?status=add&id=${id}`, "_self");
}

const searchRender = async (text, url) => {
	const result = await searchUser(text);
	tableRender(result);
};

// Events
document.getElementById("pagination").addEventListener("click", (event) => {
	const dataId = event.target.getAttribute("data-id");
	if (dataId === "previous") {
		if (page > 1) {
			page--;
			init();
		}
	} else if (dataId === "next") {
		page++;
		init();
	} else if (dataId) {
		page = +dataId.value;
		init();
	}
});

document.getElementById("search").addEventListener("keyup", (event) => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		const searchText = event.target.value;
		searchRender(searchText, BASE_URL);
	}, 3000);
});

document.getElementById("modal-delete").addEventListener("click", async () => {
	try {
		await deleteUser(idToDelete, BASE_URL);
		document.querySelector(".modal").style.display = "none";
		idToDelete = -1;
		tableRender();
		Toastify({
			text: "delete successful",
			duration: 3000,
			destination: "https://github.com/apvarun/toastify-js",
			newWindow: true,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "left", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: "linear-gradient(to right, #00b09b, #96c93d)",
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	} catch (error) {
		Toastify({
			text: "delete failed ",
			duration: 3000,
			destination: "https://github.com/apvarun/toastify-js",
			newWindow: true,
			close: true,
			gravity: "top", // `top` or `bottom`
			position: "left", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: "linear-gradient(to right, crimson, #FF91A4)",
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
});
