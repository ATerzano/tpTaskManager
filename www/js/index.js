document.addEventListener('deviceready', onDeviceReady, false);

  function onDeviceReady() {
      console.log("Cordova está listo");
  
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
  
      // Inicializa Firebase
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
  
      // Cargar tareas desde Firestore
      db.collection("tasks").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              const task = doc.data();
              const taskList = document.getElementById('task-list');
              const listItem = document.createElement('li');
              listItem.textContent = `${task.name} - ${new Date(task.date).toLocaleString()}`;
              taskList.appendChild(listItem);
          });
      });
  
      cordova.plugins.notification.local.on('trigger', function(notification) {
          navigator.notification.alert("La tarea " + notification.title + " está completa", null, "Tarea Completa", "OK");
      });
  }
  
  function addTask() {
      const taskInput = document.getElementById('task');
      const dateInput = document.getElementById('date');
      const taskName = taskInput.value;
      const taskDate = new Date(dateInput.value);
  
      if (taskName && taskDate) {
          const db = firebase.firestore();
          
          db.collection("tasks").add({
              name: taskName,
              date: taskDate.toISOString()
          })
          .then((docRef) => {
              console.log("Tarea añadida con ID: ", docRef.id);
  
              // Agregar la tarea a la lista localmente
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
          })
          .catch((error) => {
              console.error("Error al añadir la tarea: ", error);
              navigator.notification.alert("No se pudo guardar la tarea. Intenta de nuevo.", null, "Error", "OK");
          });
      } else {
          navigator.notification.alert("Por favor, ingresa el nombre y fecha de la tarea", null, "Error", "OK");
      }
  }
  