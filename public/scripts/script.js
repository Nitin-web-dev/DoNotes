const checkbox = document.querySelectorAll('input[type="checkbox"]');
const timeAndDate = document.querySelector(".timeAndDate");

function settimeandDate() {
  const now = new Date();
  const dateTime = now.toLocaleString([], {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  timeAndDate.textContent = dateTime;
}
settimeandDate();

setInterval(settimeandDate(), 1000);

checkbox.forEach((checkbox) => {
  checkbox.addEventListener("change", async function () {
    let id = this.dataset.id;
    let completed = this.checked;
    // console.log(id, completed)
    try {
      const result = await fetch(`/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      // console.log('fetch after', result)
    } catch (error) {
      console.error("error message", error.message);
    }
  });
});
