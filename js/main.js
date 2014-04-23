window.onload = function() {

	var gameContainer, canvasHeight, canvasWidth, camera, controls, scene, projector, renderer, objects = [], topTarget;

	/*

	*/

	setup('simple', .3);

	function setup(setType, orbitSpeed) {

		gameContainer = document.getElementById('game_container');

		// Camera conf

		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 3);
		camera.setLens(35);
		camera.position.z = 1;

		// Three.OrbitControls conf

		controls = new THREE.OrbitControls(camera);
		controls.rotateSpeed = orbitSpeed;
		controls.zoomSpeed = orbitSpeed * 5;
		controls.panSpeed = orbitSpeed;

		// Scene conf

		scene = new THREE.Scene();

		// Projector conf

		projector = new THREE.Projector();

		// Renderer conf

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;
		renderer.shadowMapSoft = true;

		gameContainer.appendChild(renderer.domElement);

		var canvas = renderer.domElement;

		canvasHeight = canvas.height;
		canvasWidth = canvas.width;

		// Lighing conf

		var aspecColor = 0xfff9fc;

		var simpleAmbientLight = new THREE.AmbientLight(aspecColor);

		var simpleSpotLight = new THREE.SpotLight(aspecColor, .5, 1.5, Math.PI/6, 1);
		simpleSpotLight.position.set(0, 0, 1);
		simpleSpotLight.castShadow = true;
		simpleSpotLight.shadowCameraNear = 5;
		simpleSpotLight.shadowCameraFar = camera.far;
		simpleSpotLight.shadowCameraFov = 10;
		simpleSpotLight.shadowBias = -0.00022;
		simpleSpotLight.shadowDarkness = 0.5;
		simpleSpotLight.shadowMapWidth = 2048;
		simpleSpotLight.shadowMapHeight = 2048;

		var simpleLight = new THREE.PointLight(0x7f7701, .25, 1);
		simpleLight.position.set(0, 0, .5);

		var sphereSize = .1;
		var PointLightHelper = new THREE.PointLightHelper(simpleLight,sphereSize);	
		var SpotLightHelper = new THREE.SpotLightHelper(simpleSpotLight,sphereSize);

		// Materials

		materials = {

			// Materials for simple board

			simpleBoardMat : new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture("tex/simpleboard_tex.jpg"),
				specular: aspecColor,
				shininess: 3
			}),

			simpleLightButtonMat : new THREE.MeshPhongMaterial({
				ambient: 0xbbaeac,
				color: 0xbbaeac,
				specular: aspecColor,
				shininess: 5
			}),

			simpleDarkButtonMat : new THREE.MeshPhongMaterial({
				ambient: 0x29282d,
				color: 0x29282d,
				specular: aspecColor,
				shininess: 5
			}),

			// Material for grid

			gridMat : new THREE.MeshBasicMaterial({
				color: 0x000000,
				opacity: .25,
				transparent: true,
				wireframe: true
			})
		}

		loader = new THREE.JSONLoader();

		//

		var Board = function(id, geometryAddress, material, boardName) {

			loader.load(geometryAddress, function(boardGeometry) {

				board = new THREE.Mesh(boardGeometry, material);
				board.receiveShadow = true;
				board.castShadow = true;
				board.id = id;
				board.name = boardName;

				scene.add(board);
				objects.push(board);
			});
		}

		//

		var Button = function(id, geometryAddress, material, positionX, positionY, positionZ, buttonName) {

			loader.load(geometryAddress, function(buttonGeometry) {

				button = new THREE.Mesh(buttonGeometry, material);
				button.position.x = positionX;
				button.position.y = positionY;
				button.position.z = positionZ;
				button.receiveShadow = true;
				button.castShadow = true;
				button.id = id;
				button.name = buttonName;

				scene.add(button);
				objects.push(button)
			});
		}

		var gridColumn = function(width, depth, posX, posY, elevation, gridId, sectionName) {

			var facesWide = 1;
			var facesDeep = 5;

			this.section = new THREE.Mesh(new THREE.PlaneGeometry(width, depth, facesWide, facesDeep), materials.gridMat);

			this.section.position.x = posX;
			this.section.position.y = posY;
			this.section.position.z = elevation;

			this.section.id = gridId;
			this.section.name = sectionName;

			this.section.visible = true;

			scene.add(this.section);
			objects.push(this.section);

			console.log(this.section);
		}

		// Utility functions

		function makeButtonRow(startFromHere) {

			var row = startFromHere - (buttonCount / 25);

			return row;
		}

		// Prepare setTypes

		if (setType == 'simple') {

			simpleLightingSetup = [
				simpleAmbientLight,
				simpleSpotLight,
				simpleLight,
				PointLightHelper,
				SpotLightHelper
			];

			for (var i = 0; i < simpleLightingSetup.length; i++) {

				scene.add(simpleLightingSetup[i]);
			}

 			new Board('board', 'js/simpleBoardGeometry.js', materials.simpleBoardMat, 'simpleBoard');

 			var buttonCount = 15;

			while (buttonCount--) {

				new Button('lb', 'js/simpleButtonGeometry.js', materials.simpleLightButtonMat, makeButtonRow(.2793), -.26, .005, 'lightButton-' + (buttonCount + 1));
				new Button('db', 'js/simpleButtonGeometry.js', materials.simpleDarkButtonMat, makeButtonRow(.2793), .26, .005, 'darkButton-' + (buttonCount + 1));
			}

			var columnCount = 6;

			while (columnCount--) {

				new gridColumn(.036, .185, .216 - columnCount / 26.5, -.122, .0055, 'homePlayer1', 'column-' + (columnCount + 1));
				new gridColumn(.036, .185, -.029 - columnCount / 26.5, -.122, .0055, 'outerPlayer1', 'column-' + (columnCount + 7));
				new gridColumn(.036, .185, -.2175 + columnCount / 26.5, .122, .0055, 'outerPlayer2', 'column-' + (columnCount + 13));
				new gridColumn(.036, .185, .0273 + columnCount / 26.5, .122, .0055, 'homePlayer2', 'column-' + (columnCount + 19));
			}
		}
	}

	// Window resize event

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Mouse, Keyboard events

	function castMouseRay(event) {

		event.preventDefault();

		var mouseVector = new THREE.Vector3(
			2 * (event.clientX / canvasWidth) - 1,
			1 - 2 * (event.clientY / canvasHeight));

		var raycaster = projector.pickingRay(mouseVector.clone(), camera);
		var intersects = raycaster.intersectObjects(objects);

		topTarget = intersects[0];

		if (intersects.length > 0) {

			console.log(topTarget.object);

			if (topTarget.object.id == 'lb') {

				controls.enabled = false;
			}

			if ( topTarget.object.id == 'db') {

				controls.enabled = false;
			}

			if (topTarget.object.id == 'grid') {

				controls.enabled = false;
			}
		}
	}

	function mouseRelease(event) {

		event.preventDefault();

		controls.enabled = true;
	}

	document.addEventListener('mousedown', castMouseRay, false);
	document.addEventListener('mouseup', mouseRelease, false);
	window.addEventListener('resize', onWindowResize, false);

	// Render

	console.log(objects);

	render();

	function render() {

		requestAnimationFrame(render);

		controls.update();

		renderer.render(scene, camera);
	}
};