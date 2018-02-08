/*
* Basic client js, as there are very few code, i didn't split it into some sort of structure
*/
angular.module('img', ['angularLazyImg']).controller('main', function ($scope, $http){
	$http.get('/api/images').then(function(resp){
		$scope.images = resp.data;
		$scope.sort();
	});
	$scope.delete = function(img, index){
		if($scope._images){
			for (var i = 0; i < index; i++) {
				$scope._images[i].points++;
				$http.post('/api/rate', $scope._images[i]);
			}
		}else{
			for (var i = 0; i < index; i++) {
				$scope.images[i].points++;
				$http.post('/api/rate', $scope.images[i]);
			}
		}
		for (var i = 0; i < $scope.images.length; i++) {
			if($scope.images[i].loc == img.loc){
				$scope.images.splice(i, 1);
				break;
			}
		}
		$scope.sort();
		$http.post('/api/remove', img);
	}
	$scope.sortVal="0 Points";
	$scope.sortBy = ["0 Points", "1 Points", "2 Points", "1 or more", "Less to many points", "Many to less points"];
	$scope.sort = function(){
		$scope._images = [];
		if($scope.sortVal=="0 Points"){
			for (var i = 0; i < $scope.images.length; i++) {
				if($scope.images[i].points==0){
					$scope._images.push($scope.images[i]);
				}
			}
		}else if($scope.sortVal=="1 Points"){
			for (var i = 0; i < $scope.images.length; i++) {
				if($scope.images[i].points==1){
					$scope._images.push($scope.images[i]);
				}
			}
		}else if($scope.sortVal=="2 Points"){
			for (var i = 0; i < $scope.images.length; i++) {
				if($scope.images[i].points==2){
					$scope._images.push($scope.images[i]);
				}
			}
		}else if($scope.sortVal=="1 or more"){
			for (var i = 0; i < $scope.images.length; i++) {
				if($scope.images[i].points>1){
					$scope._images.push($scope.images[i]);
				}
			}
		}else if($scope.sortVal=="Less to many points"){
			$scope._images = null;
			$scope.images.sort(function(a,b){
				if(a.points>b.points) return 1;
				else if(a.points==b.points){
					if(a.loc>b.loc) return 1;
					return -1;
				}else return -1;
			});
		}else{
			$scope._images = null;
			$scope.images.sort(function(a,b){
				if(a.points>b.points) return -1;
				else if(a.points==b.points){
					if(a.loc>b.loc) return -1;
					return 1;
				}else return 1;
			});
		}
	}
});
