var contactAppControllers = angular.module('contactApp.controllers', []);

contactAppControllers

.controller('contactListCtrl', ['$scope', '$state', 'Contact', 'popupService', 'Upload', '$timeout', function($scope, $state, Contact, popupService, Upload, $timeout){
	$scope.searchParams = [
							{ key: 'wildcard', value: 'All' },
							{ key: 'name', value: 'Name' },
							{ key: 'email', value: 'Email' },
							{ key: 'phone', value: 'Phone' },
							{ key: 'address', value: 'Address' },
							{ key: 'company', value: 'Company' }
						];
	$scope.searchQuery = {};
	$scope.searchQuery.params = 'wildcard';

	$scope.searchContacts = function () {
		var search = {};
		search[$scope.searchQuery.params] =$scope.searchQuery.keywords;

		var contacts = Contact.query(search,function () {
			$scope.contacts = contacts.data;
		});
	};

	var contacts = Contact.query(function () {
		$scope.contacts = contacts.data;
	});

	$scope.showModal = function () {
		$('#modal1').openModal();
	};

	$scope.deleteContact = function (contact) {
		if (popupService.showPopup('Really delete this?')) {
	        Contact.delete({ id: contact._id }, function(result) {
				$state.go('app.info', { message: result.data});
	        });
	    }
	};

	$scope.uploadFiles = function(file, errFiles, id) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/contacts/avatars/' + id,
                data: { avatar: file }
            });

            file.upload.then(function (result) {
                $timeout(function () {
					$state.go('app.info', { message: result.data.data });
                });
            }, function (response) {
                // if (response.status > 0)
                //     $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // file.progress = Math.min(100, parseInt(100.0 *
                //                          evt.loaded / evt.total));
            });
        }
    };
}])
.controller('contactDetailCtrl', ['$scope', '$state', '$stateParams', 'Contact', function($scope, $state, $stateParams, Contact){
	var id = $stateParams.id;

	$scope.titles = [ 'Mr.', 'Ms.', 'Sir', 'Mrs.', 'Prof', 'Dr.' ];

	if(id != 0) {
		$scope.pageTitle = "Edit Contact";
		var data = Contact.get({ id: id }, function () {
			var contact = data.data[0];
			$scope.contact = contact;

			var arrPhone = [];
			var arrEmail = [];
			var arrAddress = [];
			var arrOther = [];

			angular.forEach($scope.contact.phone, function (v, k) {
				this.push({ value: v });
			}, arrPhone);
			angular.forEach($scope.contact.email, function (v, k) {
				this.push({ value: v });
			}, arrEmail);
			angular.forEach($scope.contact.address, function (v, k) {
				this.push({ value: v });
			}, arrAddress);
			angular.forEach($scope.contact.others, function (v, k) {
				this.push({ key: Object.keys(v), value: v[Object.keys(v)] });
			}, arrOther);

			$scope.phones = (arrPhone.length === 0) ? [{ value: '' }] : arrPhone;
			$scope.emails = (arrEmail.length === 0) ? [{ value: '' }] : arrEmail;
			$scope.addresses = (arrAddress.length === 0) ? [{ value: '' }] : arrAddress;
			$scope.others = (arrOther.length === 0) ? [{ key: '', value: '' }] : arrOther;
		});
	}
	else {
		$scope.pageTitle = "Add New Contact";
		$scope.contact = new Contact();
		$scope.phones = [{ value: '' }];
		$scope.emails = [{ value: '' }];
		$scope.addresses = [{ value: '' }];
		$scope.others = [{ key: '', value: '' }];
	}

	$scope.addEmail = function () {
		$scope.emails.push({ value: '' });
	};

	$scope.removeEmail = function (index) {
		$scope.emails.splice(index, 1);
		if($scope.emails.length === 0) {
			$scope.emails = [{ value: '' }];
		}
	};

	$scope.addPhone = function () {
		$scope.phones.push({ value: '' });
	};

	$scope.removePhone = function (index) {
		$scope.phones.splice(index, 1);
		if($scope.phones.length === 0) {
			$scope.phones = [{ value: '' }];
		}
	};

	$scope.addAddress = function () {
		$scope.addresses.push({ value: '' });
	};

	$scope.removeAddress = function (index) {
		$scope.addresses.splice(index, 1);
		if($scope.addresses.length === 0) {
			$scope.addresses = [{ value: '' }];
		}
	};

	$scope.addOther = function () {
		$scope.others.push({ key: '', value: '' });
	};

	$scope.removeOther = function (index) {
		$scope.others.splice(index, 1);
		if($scope.others.length === 0) {
			$scope.others = [{ key: '', value: '' }];
		}
	};

	$scope.saveContact = function () {
		var arrPhone = [];
		var arrEmail = [];
		var arrAddress = [];
		var arrOther = [];

		angular.forEach($scope.phones, function (v, k) {
			this.push(v.value);
		}, arrPhone);
		angular.forEach($scope.emails, function (v, k) {
			this.push(v.value);
		}, arrEmail);
		angular.forEach($scope.addresses, function (v, k) {
			this.push(v.value);
		}, arrAddress);
		for(i = 0; i < $scope.others.length; i++) {
			var key = $scope.others[i].key;
			var value = $scope.others[i].value;
			var obj = {};
			obj[key] = value;
			arrOther.push(obj);
		}

		$scope.contact.phone = arrPhone;
		$scope.contact.email = arrEmail;
		$scope.contact.address = arrAddress;
		$scope.contact.others = arrOther;

		if(id != 0) {
			Contact.update($scope.contact, function(result) {
				$state.go('app.info', { message: result.data });
			},
			function (error) {
				var errMessages = error.data.message;
				var errMessage = '';
				for(i = 0; i < errMessages.length; i ++) {
					if(errMessage == '') {
						errMessage = errMessages[i];
					}
					else {
						errMessage += '<br>' + errMessages[i];
					}
				}
				$state.go('app.info', { message: errMessage });
			});
		}
		else {
			$scope.contact.$save(function(result) {
				$state.go('app.info', { message: result.data });
			},
			function (error) {
				var errMessages = error.data.message;
				var errMessage = '';
				for(i = 0; i < errMessages.length; i ++) {
					if(errMessage == '') {
						errMessage = errMessages[i];
					}
					else {
						errMessage += '<br>' + errMessages[i];
					}
				}
				$state.go('app.info', { message: errMessage });
			});
		}
	};
}])
.controller('infoCtrl', ['$scope', '$state', '$stateParams', '$sce', function ($scope, $state, $stateParams, $sce) {
	$('#modal1').openModal();
	$scope.message = $sce.trustAsHtml($stateParams.message);
	$scope.closeModal = function () {
		$('#modal1').closeModal();
		$state.go('app', {}, { reload: true });
	};
}])
;
