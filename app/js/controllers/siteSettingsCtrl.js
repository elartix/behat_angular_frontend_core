var settings = angular.module('siteSettingsCtrl', []);

settings.controller('SiteSettingsCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesSettings', 'addAlert', 'SiteHelpers', 'Noty',
    function($scope, $http, $location, $route, $routeParams, SitesSettings, addAlert, SiteHelpers, Noty){
        $scope.nav_message      = "Mocked data. You can see what the Settings page will look like, click update though your settings are not save to this fake rest api";
        $scope.nav              = { name: 'nav',        url: 'templates/shared/nav.html'};
        $scope.bc               = { name: 'bc', url: 'templates/shared/bc.html'}
        $scope.settings_browser = { name: 'settings_browser', url: 'templates/shared/settings_browser.html'}
        $scope.settings_url = { name: 'settings_url', url: 'templates/shared/settings_url.html'}
        $scope.breadcrumbs = [
            {title: "Site " + $routeParams.sid, path: "#/sites/" + $routeParams.sid },
            { title: "Settings", path:  "#"}
        ];

        if(!angular.isUndefined($routeParams.sid)) {
            SitesSettings.query({sid: $routeParams.sid}, function(data){
                $scope.settings = data.data;
                $scope.settingsForm = $scope.settings;

                $scope.browsers = SiteHelpers.browsers();
                $scope.browser_options = [];
                $scope.settingsForm.browserChosen = false;

                angular.forEach($scope.browsers, function(v, i){
                    if($scope.settings.saucelabs.browser.browser == v.browser && $scope.settings.saucelabs.browser.version == v.version) {
                        $scope.settingsForm.browserChosen = i;
                    }
                    $scope.browser_options.push(i);
                });
                $scope.settingsForm.chosenUrls = [];
            });
        } else {
            $scope.help_message = "<p>Choose a site to connect these settings to. The sites are pulled in from the DMP.</p>";
            SitesSettings.get({sid: 'create'}, function(data){
                $scope.settings = data.data;
                console.log(data.data)
                $scope.settingsForm = $scope.settings;

                $scope.browsers = SiteHelpers.browsers();
                $scope.browser_options = [];
                $scope.settingsForm.browserChosen = false;

                angular.forEach($scope.browsers, function(v, i){
                    if($scope.settings.saucelabs.browser.browser == v.browser && $scope.settings.saucelabs.browser.version == v.version) {
                        $scope.settingsForm.browserChosen = i;
                    }
                    $scope.browser_options.push(i);
                });
                $scope.settingsForm.chosenUrls = [];
            });
        }

        $scope.getCssClasses = function(ngModelController) {
            return {
                danger: ngModelController.$invalid && ngModelController.$dirty
            };
        };
        $scope.showError = function(ngModelController, error) {
            if(!angular.isUndefined(error) && !angular.isUndefined(ngModelController)) {
                return ngModelController.$error[error];
            }
        }

        $scope.unsetDefaults = function(index) {
            angular.forEach($scope.settingsForm.urls, function(v, i){
               if(i != index) {
                   $scope.settingsForm.urls[i].default = "0";
               }
            });
        };

        $scope.submitReady = function() {
            if(!$scope.settingsFormCtrl.$invalid && $scope.settingsFormCtrl.$dirty) {
                return true;
            }
        };

        $scope.showFormAlert = function(ngModelController) {
            if(ngModelController.$invalid ) {
               return true;
            }
        }

        $scope.urlRemove = function(index) {
          $scope.urlRemoved = $scope.settingsForm.urls[index];
          $scope.settingsForm.urls.splice(index, 1);
          Noty("<i class='glyphicon glyphicon-remove'></i>&nbsp;Item removed..", 'information');
        };

        $scope.alerts = [];

        $scope.addUrl = function() {
            var url = { name: "Foo", url: "http://local.foo.com", default: "0"};
            $scope.settingsForm.urls.push(url);
            Noty("New url added", 'warning');
        };

        $scope.putSettings = function() {
            var browser = $scope.settingsForm.browserChosen;
            var browserObject = SiteHelpers.getBrowserObejectFromBrowser(browser);
            for (var attrname in browserObject) { $scope.settingsForm.saucelabs.browser[attrname] = browserObject[attrname]; }
            $scope.settings = $scope.settingsForm;
            SitesSettings.updateSettings({sid: $routeParams.sid}, $scope.settings, function(data){
                addAlert(data.status, data.message, $scope);
            });
            Noty('<i class="glyphicon glyphicon-cog"></i>&nbsp;Settings updated', 'success');
            addAlert('success', 'Settings Updated', $scope);

        };


    }]);