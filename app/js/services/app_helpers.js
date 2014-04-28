var app_helpers = angular.module('app_helpers', []);

app_helpers.factory('AppHelpers', ['$rootScope',
    function($rootScope){
        return {
            sortOrder: function(column) {
                if ($rootScope.reverse == true) {
                    $rootScope.reverse = false;
                    $rootScope.sort = column;
                } else {
                    $rootScope.reverse = true;
                    $rootScope.sort = column;
                }
            },
            selectedCls: function(column) {
                if (column == $rootScope.sort || column == '-' + $rootScope.sort ) {
                    if($rootScope.reverse == true) {
                        return "glyphicon-sort-by-attributes-alt";
                    } else {
                        return 'glyphicon-sort-by-attributes';
                    }
                }
            },
            tagsFilter: function(taggedItems) {
                var tags_all = [];
                angular.forEach(taggedItems, function(v,i){
                    angular.forEach(v.tags, function(value, index){
                        if(tags_all.indexOf(value) == -1) {
                            tags_all.push(value);
                        };
                    });
                });
                return tags_all;
            },
            setTag: function(tag, scope) {
                scope.filtered.tagged = tag;
            },
            clearTag: function(scope) {
                scope.filtered.tagged = '';
            }
        }
    }]);