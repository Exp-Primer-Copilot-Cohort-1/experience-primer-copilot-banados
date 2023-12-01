function skillsMember() {
    return {
        restrict: 'E',
        templateUrl: 'partials/member.html',
        scope: {
            member: '=',
            skills: '='
        },
        controller: function($scope) {
            $scope.getSkill = function(skillId) {
                return $scope.skills.filter(function(skill) {
                    return skill.id === skillId;
                })[0];
            };
        }
    };
}