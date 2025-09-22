function main()
{
	var URLTHREEJS = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

	// utils

	function includeScript(strURL_a, cbSuccess_a, cbFailure_a)
	{
		if (!globals.loadedScripts)
		{
			globals.loadedScripts = {};
		}

		if (globals.loadedScripts[strURL_a])
		{
			cbSuccess_a();
		}
		else
		{
			$.ajax(
			{
				url: strURL_a,
				dataType: 'script',
				cache: true,
				success: function()
				{
					globals.loadedScripts[strURL_a] = true;
					cbSuccess_a();
				}
			});
		}
	}

	// helpers

	function createObjects()
	{
		var arrObjects = [];

		// create objects
		for (var i = 0; i < 100; i++)
		{
			var geometry = new THREE.BoxGeometry(1, 1, 1);
			var materials = [
				new THREE.MeshBasicMaterial({ color: getRandomColor() }),
				new THREE.MeshBasicMaterial({ color: getRandomColor() }),
				new THREE.MeshBasicMaterial({ color: getRandomColor() }),
				new THREE.MeshBasicMaterial({ color: getRandomColor() }),
				new THREE.MeshBasicMaterial({ color: getRandomColor() }),
				new THREE.MeshBasicMaterial({ color: getRandomColor() })
			];

			var objCube = new THREE.Mesh(geometry, materials);
			objCube.position.x = Math.random() * 200 - 100;
			objCube.position.y = Math.random() * 200 - 100;
			objCube.position.z = Math.random() * 200 - 100;

			var obj = {
				id: i,
				tag: 'cube',
				mesh: objCube,
				add: true,
				discard: false
			};

			arrObjects.push(obj);
		}

		return arrObjects;
	}

	function getRandomColor()
	{
		var intR = Math.floor(Math.random() * 256);
		var intG = Math.floor(Math.random() * 256);
		var intB = Math.floor(Math.random() * 256);

		return 'rgb(' + intR + ',' + intG + ',' + intB + ')';
	}

	function JCamera()
	{
		var m_objThis = this;

		var objCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		objCamera.position.z = 100; // move the camera back a bit

		return objCamera;
	}

	function JRenderer()
	{
		var m_objThis = this;

		var m_objCloseButton;
		var m_objWebGLRenderer;

		// new renderer
		m_objWebGLRenderer = new THREE.WebGLRenderer(
		{
			canvas: document.createElement('canvas'),
			antialias: true
		});

		// renderer CSS, full screen
		$(m_objWebGLRenderer.domElement).css(
		{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%'
		});

		// add the renderer to body
		$('body').append(m_objWebGLRenderer.domElement);

		// add the "X" button to body
		m_objCloseButton = $('<div style="position: fixed; top: 10px; right: 10px; font-size: 24px; cursor: pointer;">X</div>');
		$('body').append(m_objCloseButton);

		m_objCloseButton.click(function()
		{
			// remove the render dom and x from the body
			$(m_objWebGLRenderer.domElement).remove();
			$(m_objCloseButton).remove();
		});

		m_objWebGLRenderer.setSize(window.innerWidth, window.innerHeight);

		return m_objWebGLRenderer;
	}

	function JScene()
	{
		var m_objThis = this;

		var m_arrCameras = [];
		var m_objRenderer;
		var m_objScene;

		function initScene()
		{
			m_objScene = new THREE.Scene();

			var objAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
			m_objScene.add(objAmbientLight);

			var objPointLight = new THREE.PointLight(0xffffff, 1, 1000);
			objPointLight.position.set(0, 0, 100);
			m_objScene.add(objPointLight);
		}

		this.animate = function(cb_a)
		{
			if (m_objRenderer && m_arrCameras.length > 0)
			{
				requestAnimationFrame(function()
				{
					m_objThis.animate(cb_a);
				});

				cb_a();

				for (var i = 0; i < m_arrCameras.length; i++)
				{
					m_arrCameras[i].aspect = window.innerWidth / window.innerHeight;
					m_arrCameras[i].updateProjectionMatrix();
					m_objRenderer.render(m_objScene, m_arrCameras[i]);
				}
			}
		};

		this.getScene = function()
		{
			return m_objScene;
		};

		this.addCamera = function(objCamera_a)
		{
			m_arrCameras.push(objCamera_a);
		};

		this.addObjects = function(arr_a)
		{
			for (var i = 0; i < arr_a.length; i++)
			{
				if (arr_a[i].add)
				{
					m_objScene.add(arr_a[i].mesh);
				}
			}
		};

		this.removeObjects = function(arr_a)
		{
			for (var i = 0; i < arr_a.length; i++)
			{
				if (arr_a[i].discard)
				{
					m_objScene.remove(arr_a[i].mesh);
				}
			}
		};

		this.setRenderer = function(objRenderer_a)
		{
			m_objRenderer = objRenderer_a;
		};

		initScene();
	}

	includeScript(URLTHREEJS, function()
	{
		var objRenderer = new JRenderer();
		var objScene = new JScene();
		var objCamera = new JCamera();
		var arrObjects = createObjects();

		objScene.setRenderer(objRenderer);
		objScene.addCamera(objCamera);
		objScene.addObjects(arrObjects);

		// animation variables
		var intCameraZ = 100;
		var intCameraDirection = -1;

		objScene.animate(function()
		{
			// animate the objects
			for (var i = 0; i < arrObjects.length; i++)
			{
				arrObjects[i].mesh.rotation.x += 0.05;
				arrObjects[i].mesh.rotation.y += 0.05;
				if (Math.random() < 0.1)
				{
					arrObjects[i].mesh.rotation.x += Math.random() * 0.1 - 0.05;
					arrObjects[i].mesh.rotation.y += Math.random() * 0.1 - 0.05;
				}
			}

			// animate the scene
			objScene.getScene().rotation.y += 0.01;

			// animate the camera
			intCameraZ += intCameraDirection * 0.5;

			if (intCameraZ < 50 || intCameraZ > 150)
			{
				intCameraDirection *= -1;
			}

			objCamera.position.z = intCameraZ;
		});
	});
}

main();