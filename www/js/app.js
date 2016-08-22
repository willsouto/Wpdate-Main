(function() {

var app = angular.module('wpdate', ['ionic' , 'angularMoment']);
app.controller('WpdateCtrl', function($http, $scope) {
  
  $scope.stories = [];


  /** TEMP START **/
  $scope.result = "";
  $http.get('https://api.wunderground.com/api/8ed586309bee0204/conditions/forecast/lang:BR/q/BR/Santo_Andre.json')
    .success(function(data, status, headers,config){
      console.log('data success');
      console.log(data); // for browser console
      $scope.result = data; // for UI
    })
    .error(function(data, status, headers,config){
      console.log(data);
    })
    .then(function(result){
      things = result.data;
    });
  /** TEMP END **/


  /** DOLAR START **/

  $scope.resultd = "";
  $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%3D%22USDBRL%22&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
    .success(function(data, status, headers,config){
      console.log('data success');
      console.log(data); // for browser console
      $scope.resultd = data; // for UI
    })
    .error(function(data, status, headers,config){
      console.log(data);
    })
    .then(function(result){
      things = resultd.data;
    });

  /** DOLAR END **/

/** REDDIT top START **/

  /** load de historia **/
  function loadStories(params, callback){
      $http.get('https://www.reddit.com/top/.json', {params:params})
        .success(function(response){
          var stories = [];
          angular.forEach(response.data.children, function(child){
            var story = child.data;
            if (!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default'){
              story.thumbnail = 'http://www.redditstatic.com/icon.png';
            }
            else if(story.thumbnail === 'nsfw'){
               story.thumbnail = 'http://i.imgur.com/UHzw6.png';
            }
           stories.push(child.data);
           console.log($scope.stories);
          });
          callback(stories);
        });
  };

  /** load de historia antiga no scroll down **/
    $scope.loadOlderStories = function(){
      var params = {};
      if($scope.stories.length > 0){
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params , function(olderStories){
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };


  /** load de historia recent no scroll up **/
    $scope.loadNewerStories = function(){
      var params = {'before': $scope.stories[0].name};
      loadStories(params, function(newerStories){
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.openLink = function(url){
      windows.open(url, '_blank');
    };

    /** REDDIT top END **/

    
    /** REDDIT funny START **/
    $scope.storiesimg = [];
  /** load de img **/
  function loadStoriesimg(params, callback){
      $http.get('https://www.reddit.com/r/funny/.json', {params:params})
        .success(function(response){
          var storiesimg = [];
          angular.forEach(response.data.children, function(child){
            var storyimg = child.data;
            if (storyimg.domain != 'i.redd.it' && storyimg.domain != 'img.photobucket.com' && storyimg.domain != 'i.imgur.com' && storyimg.domain != 'files.explosm.net' && storyimg.domain != 'lolzcart.com'){
              if(storyimg.domain == 'imgur.com' && storyimg.domain != 'imgur.com/gallery'){
                storyimg.url = storyimg.url+".jpg";
                }
                else{
              storyimg.url = storyimg.url;
              }
            }
            
           storiesimg.push(child.data);
           console.log($scope.storiesimg);
          });
          callback(storiesimg);
        });
  };

  /** load de historia antiga no scroll down **/
    $scope.loadOlderStoriesimg = function(){
      var params = {};
      if($scope.storiesimg.length > 0){
        params['after'] = $scope.storiesimg[$scope.storiesimg.length - 1].name;
      }
      loadStoriesimg(params , function(olderStoriesimg){
        $scope.storiesimg = $scope.storiesimg.concat(olderStoriesimg);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };


  /** load de historia recent no scroll up **/
    $scope.loadNewerStoriesimg = function(){
      var params = {'before': $scope.storiesimg[0].name};
      loadStoriesimg(params, function(newerStoriesimg){
        $scope.storiesimg = newerStoriesimg.concat($scope.storiesimg);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    

    /** REDDIT funny END **/

    /** CNN START **/
    $scope.storiescnn = [];
    $http.get('https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=427a9b85ce36450c9375d60c4e974c37')
    .success(function(response){
      angular.forEach(response.articles, function(child){
       $scope.storiescnn.push(child);
       console.log($scope.storiescnn);
      });
    });
    /** CNN END **/

    /** NYT START **/
    $scope.storiesnyt = [];
    $http.get('https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=popular&apiKey=427a9b85ce36450c9375d60c4e974c37')
    .success(function(response){
      angular.forEach(response.articles, function(child){
       $scope.storiesnyt.push(child);
       console.log($scope.storiesnyt);
      });
    });
    /** NYT END **/
});
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.cordova && window.cordova.InAppBrowser){
      window.open = window.cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
