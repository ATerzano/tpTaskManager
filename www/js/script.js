document.addEventListener('deviceready', function() {
    console.log('Cordova está listo');
    cordova.plugins.notification.local.on('trigger', function(notification) {
        navigator.notification.alert("La tarea " + notification.title + " está completa", null, "Tarea Completa", "OK");
    });
}, false);

function addTask() {
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    const taskName = taskInput.value;
    const taskDate = new Date(dateInput.value);

    if (taskName && taskDate) {
        // Agregar la tarea a la lista
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${taskName} - ${taskDate.toLocaleString()}`;
        taskList.appendChild(listItem);

        // Programar la notificación
        cordova.plugins.notification.local.schedule({
            title: taskName,
            text: '¡Tarea completada!',
            trigger: { at: taskDate },
            foreground: true
        });

        // Limpiar el formulario
        taskInput.value = '';
        dateInput.value = '';
    } else {
        navigator.notification.alert("Por favor, ingresa el nombre y fecha de la tarea", null, "Error", "OK");
    }
}
