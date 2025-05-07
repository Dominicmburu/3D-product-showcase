let scene, camera, renderer, controls;
let loadingManager, gltfLoader;
let currentModel = null;
let wireframeMode = false;
let autoRotate = false;

let ambientLight, directionalLight, spotLight;

const canvas = document.getElementById('3d-canvas');
const loadingIndicator = document.getElementById('loading-indicator');

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7); 

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;   
    controls.maxDistance = 20;    
    controls.zoomSpeed = 1.5;   
    
    setupLights();
    
    setupLoadingManager();
    
    loadModel('model1');
    
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

function setupLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-5, 5, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.2;
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function setupLoadingManager() {
    loadingManager = new THREE.LoadingManager();
    
    loadingManager.onStart = function() {
        loadingIndicator.style.display = 'block';
    };
    
    loadingManager.onLoad = function() {
        loadingIndicator.style.display = 'none';
    };
    
    loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        // Progress tracking can be implemented here
    };
    
    loadingManager.onError = function(url) {
        console.error('Error loading: ' + url);
        loadingIndicator.textContent = 'Error loading model';
    };
    
    gltfLoader = new THREE.GLTFLoader(loadingManager);
}

function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (autoRotate && currentModel) {
        currentModel.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
}

function loadModel(modelId) {
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
    }
    
    controls.reset();
    
    const modelPaths = {
        'model1': 'models/soda can.glb',
        'model2': 'models/coca-cola.glb',
        'model3': 'models/SodaCan.glb'
    };
    
    const path = modelPaths[modelId];
    
    gltfLoader.load(path, function(gltf) {
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 2 / size;
        model.scale.set(scale, scale, scale);
        
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x * scale;
        model.position.y -= center.y * scale;
        model.position.z -= center.z * scale;
        
        model.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                child.userData.originalMaterial = child.material.clone();
            }
        });
        
        scene.add(model);
        currentModel = model;
        
        if (wireframeMode) {
            toggleWireframe(true);
        }
        
        updateModelInfo(modelId);
    });
}

function toggleWireframe(enabled) {
    wireframeMode = enabled;
    
    if (currentModel) {
        currentModel.traverse(function(child) {
            if (child.isMesh) {
                if (wireframeMode) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x0088ff,
                        wireframe: true
                    });
                } else {
                    child.material = child.userData.originalMaterial.clone();
                }
            }
        });
    }
}

function toggleAutoRotate(enabled) {
    autoRotate = enabled;
}

function updateCameraZoom(zoomDistance) {
    if (camera && controls) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        const target = controls.target.clone();
        const newPos = target.clone().add(direction.multiplyScalar(-zoomDistance));
        
        camera.position.copy(newPos);
    }
}

function resetView() {
    controls.reset();
}

function updateAmbientLight(intensity) {
    ambientLight.intensity = intensity;
}

function updateDirectionalLight(intensity) {
    directionalLight.intensity = intensity;
}

function toggleSpotlight(enabled) {
    spotLight.visible = enabled;
}

function updateModelInfo(modelId) {
    document.querySelectorAll('.model-info').forEach(el => {
        el.classList.add('d-none');
    });
    
    const modelInfo = document.getElementById(`${modelId}-info`);
    if (modelInfo) {
        modelInfo.classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', init);