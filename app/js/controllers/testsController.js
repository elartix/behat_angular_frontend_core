var testsController = angular.module('testsController', ['ngSanitize']);

testsController.controller('TestController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices', 'BehatServices', 'addAlert', 'runTest', 'closeAlert',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices, BehatServices, addAlert, runTest, closeAlert){
        $scope.nav = { name: 'nav', url: 'templates/nav.html'}
        $scope.nav_message = "Mocked data. You can click on <b>run</b> or <b>edit</b>"
        $scope.alerts = [];
        $scope.test_results = '<strong>Click run to see results...</strong>';

        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
        });

        $scope.closeAlert = function(index) {
            closeAlert(index, $scope);
        };

        $scope.runTest = function() {
              runTest('success', 'Running test...', $scope);
        }
    }]);

testsController.controller('TestEditController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices', 'BehatServices', 'addAlert', 'runTest', 'closeAlert',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices, BehatServices, addAlert, runTest, closeAlert){
        $scope.nav = { name: 'nav', url: 'templates/nav.html'}
        $scope.nav_message = "Mocked data. You can click on <b>any form item</b> as well as <b>run</b> and <b>any left side nav</b> <b>save</b> as well as use <b>Ace Editor</b> </b>"
        $scope.steps = {}
        $scope.form_tags = {}
        $scope.steps.default = "Your Step Here..."

        $scope.alerts = [];
        $scope.test_results = '<strong>Click run to see results...</strong>';

        $scope.token = $http({method: 'GET', url:'/services/session/token'}).success(
            function(data, status, headers, config){
                $http.defaults.headers.post['X-CSRF-Token'] = data;
            }
        );
        $scope.tests = TestsServices.get({sid: $routeParams.sid, tname: $routeParams.tname}, function(data) {
            $scope.test = data;
            $scope.test_content = data.content;
            $scope.test_html = data.content_html;
        });
        $scope.sites = SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
        });

        $scope.closeAlert = function(index) {
            closeAlert(index, $scope);
        };

        $scope.runTest = function() {
            runTest('success', 'Running test...', $scope);
        }

        $scope.saveTest = function(model) {
            addAlert('info', 'Saving test..', $scope);
            $scope.test.content = model;
            var params = {
                'test': $scope.test,
                'site': $scope.site
            }
            $results = TestsServices.update({sid: $routeParams.sid, tname: $routeParams.tname}, params);
            console.log($results);
            addAlert('info', 'Test Saved..', $scope);
        }

        $scope.addTag = function(tags) {
            var text = $scope.test_content.split("\n");
            if(text[0].indexOf('@') != -1) {
                console.log('found a tag');
                var tags = text[0] + " " + tags;
                text[0] = tags;
                $scope.test_content = text.join("\n");
            } else {
                $scope.test_content = tags + "\n" + $scope.test_content;
            }
        }

        $scope.addStep = function(step) {
            var build = [];
            var count = 1;
            angular.forEach(step, function(v, k){
                var output = '';
                if(typeof(v) === 'string') {
                    if(k.indexOf('arg_') != -1) {
                        output = '"' + v + '"'
                    } else {
                        output = v;
                    }
                }

                if(count === 1) {
                    if(k === 'feature') {
                        if(k === 'background' || k === 'scenario') {
                            output = '  ' + output;
                        } else {
                            output = '    ' + output;
                        }
                    }
                }
                build.push(output);
                count++;
            });
            $scope.test_content = $scope.test_content + "\n" + build.join(' ');
        };

        //@TODO move ace into a shared service, or
        $scope.testLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _editor.setShowInvisibles(true);
            _editor.setDisplayIndentGuides(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        }

        $scope.search = '';

        $scope.searchForms = function(search) {
            $scope.search = search;
        }

        $scope.showForm = function(form_tags_form) {
            if($scope.search !== '') {


                if(form_tags_form.indexOf($scope.search.search) !== -1) {
                   return true;
                } else {
                   return false;
                }

            } else {
                return true;
            }
        }
    }]);

testsController.controller('TestNewController', ['$scope', '$http', '$location', '$route', '$routeParams', 'SitesServices', 'TestsServices',
    function($scope, $http, $location, $route, $routeParams, SitesServices, TestsServices){
        $scope.token = $http({method: 'GET', url:'/services/session/token'}).success(
            function(data, status, headers, config){
                $http.defaults.headers.post['X-CSRF-Token'] = data;
            }
        );

        $scope.nav = { name: 'nav', url: 'templates/nav.html'}
        $scope.nav_message = "Mocked data. <b>Not much here go and edit <a href='#/sites/2/tests/test2_feature/edit'>test2</a></b>"

        $scope.test = {};
        $scope.site = {};

        var name = new Date().getTime();
        name = name + '.feature';

        $scope.test.name = name;
        $scope.test_content = "Feature: Start Your Test..";
        SitesServices.get({sid: $routeParams.sid}, function(data) {
            $scope.site = data;
            $scope.test = {
                "name": $scope.test.name,
                "path": $scope.site.test_files_root_path + '/' + name,
                "content": ''
            };
        });

        $scope.saveTest = function(model) {
            //1. take the latest model and pass it to the endpoint
            $scope.test.content = model;
            var params = {
                'test': $scope.test,
                'site': $scope.site
            }

            TestsServices.create({sid: $routeParams.sid}, params, function(data){
                if(data.errors === 0){
                    console.log(data);
                    $location.path("/sites/" + $scope.site.nid + "/tests/" + data.data.name_dashed + "/edit");
                } else {
                    //output a message to the user
                }
            });
        }

        $scope.testLoaded = function(_editor) {
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _editor.setReadOnly(true);
            _editor.setShowInvisibles(true);
            _editor.setDisplayIndentGuides(true);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
        }
    }]);