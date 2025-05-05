
document.addEventListener('DOMContentLoaded', function() {
    const model1Btn = document.getElementById('model1-btn');
    const model2Btn = document.getElementById('model2-btn');
    const model3Btn = document.getElementById('model3-btn');
    
    if (model1Btn) {
        model1Btn.addEventListener('click', function() {
            loadModel('model1');
            updateActiveModelButton(this);
        });
    }
    
    if (model2Btn) {
        model2Btn.addEventListener('click', function() {
            loadModel('model2');
            updateActiveModelButton(this);
        });
    }
    
    if (model3Btn) {
        model3Btn.addEventListener('click', function() {
            loadModel('model3');
            updateActiveModelButton(this);
        });
    }
    
    function updateActiveModelButton(activeButton) {
        document.querySelectorAll('.model-btn').forEach(button => {
            button.classList.remove('active');
        });
        
        activeButton.classList.add('active');
    }
    
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    function toggleFullscreen() {
        const canvasContainer = document.querySelector('#3d-canvas').parentElement;
        
        if (!document.fullscreenElement) {
            canvasContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            
            canvasContainer.classList.add('fullscreen-mode');
            
            const exitButton = document.createElement('button');
            exitButton.className = 'fullscreen-exit';
            exitButton.innerHTML = '<i class="fas fa-times"></i>';
            exitButton.addEventListener('click', () => {
                document.exitFullscreen();
            });
            
            canvasContainer.appendChild(exitButton);
        }
    }
    
    document.addEventListener('fullscreenchange', function() {
        const canvasContainer = document.querySelector('#3d-canvas').parentElement;
        
        if (!document.fullscreenElement) {
            canvasContainer.classList.remove('fullscreen-mode');
            
            const exitButton = canvasContainer.querySelector('.fullscreen-exit');
            if (exitButton) {
                exitButton.remove();
            }
            
            window.dispatchEvent(new Event('resize'));
        }
    });
});


function createBottleModel() {

    const bottleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const bottleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0055ff,
        metalness: 0.1,
        roughness: 0.2
    });
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
    
    const bottleGroup = new THREE.Group();
    bottleGroup.add(bottle);
    
    const neckGeometry = new THREE.CylinderGeometry(0.2, 0.5, 0.5, 32);
    const neck = new THREE.Mesh(neckGeometry, bottleMaterial);
    neck.position.y = 1.25;
    bottleGroup.add(neck);
    
    const capGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 32);
    const capMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.1
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1.6;
    bottleGroup.add(cap);
    
    return bottleGroup;
}

function createCanModel() {
    const canGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const canMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdd0000,
        metalness: 0.7,
        roughness: 0.1
    });
    const can = new THREE.Mesh(canGeometry, canMaterial);
    
    const canGroup = new THREE.Group();
    canGroup.add(can);
    
    const topRimGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
    });
    const topRim = new THREE.Mesh(topRimGeometry, rimMaterial);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = 0.75;
    canGroup.add(topRim);
    
    const topGeometry = new THREE.CircleGeometry(0.5, 32);
    const top = new THREE.Mesh(topGeometry, rimMaterial);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.75;
    canGroup.add(top);
    
    return canGroup;
}

function createPremiumBottleModel() {

    const points = [];
    
    for (let i = 0; i < 10; i++) {
        const y = i * 0.2 - 1;
        let x;
        if (i < 2) {
            x = 0.3 + (i * 0.1);
        } else if (i < 5) {
            x = 0.5 - ((i - 2) * 0.03);
        } else if (i < 8) {
            x = 0.41 + ((i - 5) * 0.03);
        } else {
            x = 0.5 - ((i - 8) * 0.1);
        }
        points.push(new THREE.Vector2(x, y));
    }
    
    const bottleGeometry = new THREE.LatheGeometry(points, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });
    
    const bottle = new THREE.Mesh(bottleGeometry, glassMaterial);
    
    const bottleGroup = new THREE.Group();
    bottleGroup.add(bottle);
    
    const neckGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 32);
    const neck = new THREE.Mesh(neckGeometry, glassMaterial);
    neck.position.y = 1;
    bottleGroup.add(neck);
    
    const capGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
    const capMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.1
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1.33;
    bottleGroup.add(cap);
    
    return bottleGroup;
}