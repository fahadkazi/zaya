var app = angular.module('zayaApp', []);

app.factory('mainInfo', function($http) {
	return $http.get('data.json');
})

app.controller('listCtrl', ['$scope', '$http', '$filter', 'mainInfo', function($scope, $http, $filter, mainInfo){

	mainInfo.then(function successCallback(response) {
		$scope.listData = response.data.data;
        $scope.subjectList = response.data.data;
        $scope.gradeList = response.data.data;
        $scope.filterOptions = response.data.data;
	}, function errorCallback(response) {
		$scope.error = response.statusText;
	});

	$scope.filterOptions = $scope.listData;

	$scope.search = function() {
		if($scope.subject != undefined && $scope.grade != undefined){
        	$scope.listData = $filter('filter')($scope.filterOptions, {subject: $scope.subject.subject, grade: $scope.grade.grade } );
      	} else if ($scope.subject != undefined && $scope.grade == undefined){
        	$scope.listData = $filter('filter')($scope.filterOptions, {subject: $scope.subject.subject } );
      	} else if($scope.subject == undefined && $scope.grade != undefined){
            $scope.listData = $filter('filter')($scope.filterOptions, { grade: $scope.grade.grade } );
      	} else{
          $scope.listData = $scope.filterOptions;
      	}
	}

	$scope.remove = function() {
		// body...
	}


}]);

app.directive('draggable', function() {
    return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});

app.directive('droppable', function() {
    return {
        scope: {
        	drop: '&', // parent
        	bin: '=' // bi-directional scope
        },
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener(
			    'dragover',
			    function(e) {
			        e.dataTransfer.dropEffect = 'move';
			        // allows us to drop
			        if (e.preventDefault) e.preventDefault();
			        this.classList.add('over');
			        return false;
			    },
			    false
			);

			el.addEventListener(
			    'dragenter',
			    function(e) {
			        this.classList.add('over');
			        return false;
			    },
			    false
			);

			el.addEventListener(
			    'dragleave',
			    function(e) {
			        this.classList.remove('over');
			        return false;
			    },
			    false
			);

			el.addEventListener(
			    'drop',
			    function(e) {
			        // Stops some browsers from redirecting.
			        if (e.stopPropagation) e.stopPropagation();

			        this.classList.remove('over');

			        var binId = this.id;

					var item = document.getElementById(e.dataTransfer.getData('Text'));

					this.appendChild(item);

					// call the passed drop function
					scope.$apply(function(scope) {
					    var fn = scope.drop();
					    if ('undefined' !== typeof fn) {
					      fn(item.id, binId);
					    }
					});

			        return false;
			    },
			    false
			);
        }
    }
});