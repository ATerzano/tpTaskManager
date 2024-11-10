// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2Sx_MxuI-7ni3Mjq4oWYZ4tMH8D0Ym9k",
    authDomain: "taskmanager-3da1b.firebaseapp.com",
    databaseURL: "https://taskmanager-3da1b-default-rtdb.firebaseio.com",
    projectId: "taskmanager-3da1b",
    storageBucket: "taskmanager-3da1b.firebasestorage.app",
    messagingSenderId: "646604968734",
    appId: "1:646604968734:web:a4ca5c9fd044462b722f0f"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('deviceready', function() {
    console.log('Cordova está listo');
    loadTasks();  // Cargar las tareas guardadas cuando la app esté lista

    cordova.plugins.notification.local.on('trigger', function(notification) {
        navigator.notification.alert("La tarea " + notification.title + " está completa", null, "Tarea Completa", "OK");

        // Buscar la tarea en Firebase y actualizar su estado a completada
        database.ref('tasks').orderByChild('name').equalTo(notification.title).once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.ref.update({ completed: true });
            });
        });
    });
}, false);

// Función para agregar una tarea
function addTask() {
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    const taskName = taskInput.value;
    const taskDate = new Date(dateInput.value);

    if (taskName && taskDate) {
        // Agregar la tarea a la lista en la interfaz de usuario
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${taskName} - ${taskDate.toLocaleString()}`;
        taskList.appendChild(listItem);

        // Guardar la tarea en Firebase
        const newTaskRef = database.ref('tasks').push();
        newTaskRef.set({
            name: taskName,
            date: taskDate.toISOString(),
            completed: false
        });

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

// Función para cargar y mostrar tareas guardadas desde Firebase
function loadTasks() {
    const taskList = document.getElementById('task-list');
    database.ref('tasks').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const task = childSnapshot.val();
            const listItem = document.createElement('li');
            listItem.textContent = `${task.name} - ${new Date(task.date).toLocaleString()}`;
            if (task.completed) {
                listItem.style.textDecoration = "line-through"; // Marcar como completada
            }
            taskList.appendChild(listItem);
        });
    });
}
