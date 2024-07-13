document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeLink = document.getElementById("theme-link");
    const modal = document.getElementById("modal");
    const eventForm = document.getElementById("event-form");
    const addEventButton = document.getElementById("add-event");
    const shareDateButton = document.getElementById("share-date");
    const closeModal = document.getElementsByClassName("close")[0];
    const calendarContainer = document.getElementById("calendar-container");
    const selectedDateDisplay = document.getElementById("selected-date");
    const dateEvents = document.getElementById("date-events");
    
    let events = {}; // Store events in an object
    
    themeToggle.addEventListener("click", () => {
        if (themeLink.getAttribute("href") === "styles/light-theme.css") {
            themeLink.setAttribute("href", "styles/dark-theme.css");
        } else {
            themeLink.setAttribute("href", "styles/light-theme.css");
        }
    });
    
    addEventButton.addEventListener("click", () => {
        modal.style.display = "block";
    });
    
    shareDateButton.addEventListener("click", () => {
        const selectedDate = selectedDateDisplay.textContent;
        const eventDetails = events[selectedDate];
        if (eventDetails) {
            const shareURL = `abinbn.github.io/calendry/${selectedDate.replace(/\//g, "-")}/${eventDetails.type}+${encodeURIComponent(eventDetails.description)}`;
            navigator.clipboard.writeText(shareURL).then(() => {
                alert("Share URL copied to clipboard!");
            });
        }
    });
    
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const eventData = new FormData(eventForm);
        const eventDate = eventData.get("event-date");
        const eventType = eventData.get("event-type");
        const eventDesc = eventData.get("event-desc");
        const eventTime = eventData.get("event-time") || "00:00";
        const eventAudio = eventData.get("event-audio") || "default-alarm-1.mp3";
        const customEventAudio = eventData.get("custom-event-audio");
    
        const eventDetails = {
            date: eventDate,
            type: eventType,
            description: eventDesc,
            time: eventTime,
            audio: customEventAudio ? URL.createObjectURL(customEventAudio) : `sounds/${eventAudio}`
        };
    
        events[eventDate] = eventDetails;
    
        // Add event to the calendar or respective list
        if (eventType === "todo") {
            addToList("todo-list", eventDetails);
        } else {
            addToList("schedule-list", eventDetails);
        }
    
        modal.style.display = "none";
        eventForm.reset();
    });
    
    function addToList(listId, eventDetails) {
        const list = document.getElementById(listId);
        const listItem = document.createElement("li");
        listItem.textContent = `${eventDetails.date} ${eventDetails.time}: ${eventDetails.description}`;
        listItem.classList.add(eventDetails.type === "todo" ? "todo-item" : "schedule-item");
        if (eventDetails.type === "todo") {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    listItem.classList.add("completed");
                } else {
                    listItem.classList.remove("completed");
                }
            });
            listItem.prepend(checkbox);
        }
        listItem.addEventListener("click", () => {
            const audio = new Audio(eventDetails.audio);
            audio.play();
        });
        list.appendChild(listItem);
    }
    
    function generateCalendar() {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const currentDay = today.getDate();
    
        const calendarTable = document.createElement("table");
        const headerRow = document.createElement("tr");
    
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach(day => {
            const th = document.createElement("th");
            th.textContent = day;
            headerRow.appendChild(th);
        });
    
        calendarTable.appendChild(headerRow);
    
        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");
                if (i === 0 && j < new Date(year, month, 1).getDay()) {
                    cell.textContent = "";
                } else if (date > daysInMonth) {
                    break;
                } else {
                    cell.textContent = date;
                    if (date === currentDay) {
                        cell.classList.add("current-date");
                    }
                    cell.addEventListener("click", () => {
                        selectDate(`${date}/${month + 1}/${year}`);
                    });
                    cell.addEventListener("mouseover", (e) => {
                        showTooltip(e, events[`${date}/${month + 1}/${year}`]);
                    });
                    cell.addEventListener("mouseout", hideTooltip);
                    date++;
                }
                row.appendChild(cell);
            }
            calendarTable.appendChild(row);
        }
    
        calendarContainer.appendChild(calendarTable);
    }
    
    function selectDate(date) {
        selectedDateDisplay.textContent = date;
        const eventDetails = events[date];
        if (eventDetails) {
            dateEvents.innerHTML = `<li>${eventDetails.time}: ${eventDetails.description}</li>`;
        } else {
            dateEvents.innerHTML = "<li>No events</li>";
        }
    }
    
    function showTooltip(e, eventDetails) {
        if (eventDetails) {
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.textContent = `${eventDetails.time}: ${eventDetails.description}`;
            document.body.appendChild(tooltip);
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            tooltip.style.display = "block";
        }
    }
    
    function hideTooltip() {
        const tooltip = document.querySelector(".tooltip");
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    generateCalendar();
    });