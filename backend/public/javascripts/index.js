function getEventInfo(event) {
	const eventObj = JSON.parse(event);
	console.log(eventObj);
	console.log('ID', eventObj._id);
	const exampleModal = document.getElementById('exampleModal');
	exampleModal.innerHTML = '';

	const tag = document.createElement('div');
	tag.setAttribute('class', 'modal-dialog');
	tag.innerHTML =
		'<div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">' +
		eventObj.name +
		'</h5><button type="button" class="btn-close" data-bs-dismiss="modal"aria-label="Close"></button></div><div class="modal-body"><img id="modalImage" src="/images/events/' +
		eventObj._id +
		'.png" alt="image" width="100%" /></div><div class="modal-footer justify-content-center"><a href="/event/viewDetails/' +
		eventObj._id +
		'"><button type="button" class="btn btn-secondary" >View Details</button></a></div></div>';

	exampleModal.appendChild(tag);
}

function viewDates(objString) {
	const { event, locationID } = JSON.parse(objString);
	const location = event.locations.find((location) => location._id === locationID);

	//Get old content
	const listDates = document.getElementById('listDates');

	//Delete old content
	listDates.innerHTML = '';

	if (location && !location.dates.includes(null)) {
		const table = createHtmltag('table', 'table table-bordered');
		const rows = createHtmltag('tr');

		rows.appendChild(createHtmltag('th', 'text-center', 'Dates'));
		rows.appendChild(createHtmltag('th', 'text-center', 'Tickets Selled'));
		rows.appendChild(createHtmltag('th', 'text-center', 'Capacity'));
		table.appendChild(rows);

		location?.dates.forEach((date) => {
			const availableCapacity = location.capacity * (location.capacityLimitation / 100);
			const tBody = createHtmltag('tr');
			tBody.appendChild(createHtmltag('td', 'text-center', `${new Date(date.date).toLocaleDateString()}`));
			tBody.appendChild(createHtmltag('td', 'text-center', `${availableCapacity - date.availableTickets}`));
			tBody.appendChild(createHtmltag('td', 'text-center', `${availableCapacity}`));
			table.appendChild(tBody);
		});
		listDates.appendChild(table);
	} else {
		listDates.appendChild(createHtmltag('h6', 'text-center', 'No Dates'));
	}
}

function loadPreviousSelectedLocals(obj) {
	const locationsChecked = document.getElementsByName('locationsChecked');
	const objParse = JSON.parse(obj);
	const { event } = objParse;

	locationsChecked.forEach((tagInputCheck) => {
		if (event.locations.some((local) => tagInputCheck.value == local._id)) {
			tagInputCheck.setAttribute('checked', '');
			const datesLocation = document.getElementById(tagInputCheck.value);

			const local = event.locations.find((local) => local._id == tagInputCheck.value);

			let dates = [];
			local.dates.map((date) => dates.push(date.date.substring(0, 10)));

			dates = JSON.stringify(dates).replace(/"/g, '');
			dates = dates.substring(1, dates.length - 1);

			datesLocation.value = dates;
		}
	});
}

function createHtmltag(type, classContent = '', innerHTML = '') {
	const element = document.createElement(type);
	element.setAttribute('class', classContent);
	element.innerHTML = innerHTML;
	return element;
}
