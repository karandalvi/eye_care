const {app,  Tray,  Menu} = require('electron');
const path = require('path');
const iconPath = path.join(__dirname, 'icon.png');
const notifier = require('node-notifier')
let trayApp = null;
var status = "Enabled"            //Application is in enabled mode at start up
var interval = 1000 * 60 * 20;  //Default Interval set to 20 mins
var notificationId = 0;
var intervalID;

//Creates a notification informing the user to look away from the screen
function sendNotification() {
  notificationId++;
  notifier.notify({
      title: 'Eye Care',
      message: 'Look away at some far object and blink for ' +
               '10-15 seconds to relax your eyes!',
      icon: iconPath,
      sound: true,
      wait: true,
      id: notificationId,
      remove: notificationId - 1
    },
    function(err, response) {
      console.log(err);
    });
}

//Starts a new interval period if the app is in enabled state
function startNewInterval() {
  clearInterval(intervalID);
  if (status === "Enabled") {
    intervalID = setInterval(function() {
      sendNotification()
    }, interval);
  }
}

//Return the contextMenu
function getContextMenu() {
  let enableIcon = path.join(__dirname, status + '.png');
  let contextMenu = Menu.buildFromTemplate([{
      label: " Enabled",
      type: 'checkbox',
      checked: status == "Enabled",
      // icon: enableIcon,
      click: function() {
        if (status === "Disabled") {
          status = "Enabled"
          trayApp.setContextMenu(getContextMenu());
        }
        else {
          status = "Disabled"
          trayApp.setContextMenu(getContextMenu());
          clearInterval(intervalID)
        }
        notificationId++;
        notifier.notify({
          title: 'Eye Care',
          message: 'Status: ' + status,
          icon: iconPath,
          sound: true,
          wait: false,
          id: notificationId,
          remove: notificationId - 1
        }, function(err, response) {
          console.log(response);
        })
        startNewInterval()
      }
    },
    {
      label: 'Modify Interval',
      submenu: [
        {
          label: '10 mins',
          type: 'radio',
          click: function() {
            interval = 1000 * 60 * 10;
            startNewInterval()
          },
          checked: interval == (1000 * 60 * 10)
        },
        {
          label: '20 mins',
          type: 'radio',
          click: function() {
            interval = 1000 * 60 * 20;
            startNewInterval();
          },
          checked: interval == (1000 * 60 * 20)
        },
        {
          label: '30 mins',
          type: 'radio',
          click: function() {
            interval = 1000 * 60 * 30;
            startNewInterval();
          },
          checked: interval == (1000 * 60 * 30)
        }
      ]
    },
    {
      label: 'Exit',
      click: function() {
        app.exit()
      }
    }
  ]);
  return contextMenu;
}

app.on('ready', () => {
  trayApp = new Tray(iconPath);
  enableIcon = path.join(__dirname, status + '.png');
  var contextMenu = getContextMenu();
  trayApp.setToolTip("Eye Care Application");
  trayApp.setContextMenu(contextMenu);
})

//Source for App Icon
//<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
