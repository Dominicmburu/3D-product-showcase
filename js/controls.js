document.addEventListener('DOMContentLoaded', function() {
    const wireframeBtn = document.getElementById('wireframe-btn');
    if (wireframeBtn) {
        wireframeBtn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active', 'btn-primary');
                this.classList.add('btn-outline-secondary');
            } else {
                this.classList.remove('btn-outline-secondary');
                this.classList.add('active', 'btn-primary');
            }
            
            toggleWireframe(!isActive);
        });
    }
    
    const rotateBtn = document.getElementById('rotate-btn');
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                this.classList.remove('active', 'btn-primary');
                this.classList.add('btn-outline-secondary');
            } else {
                this.classList.remove('btn-outline-secondary');
                this.classList.add('active', 'btn-primary');
            }
            
            toggleAutoRotate(!isActive);
        });
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetView();
            
            const zoomControl = document.getElementById('zoom-control');
            if (zoomControl) {
                zoomControl.value = 7;
            }
        });
    }
    
    const zoomControl = document.getElementById('zoom-control');
    if (zoomControl) {
        zoomControl.addEventListener('input', function() {
            const zoomValue = parseFloat(this.value);
            updateCameraZoom(zoomValue);
        });
    }
    
    const ambientLightSlider = document.getElementById('ambient-light');
    if (ambientLightSlider) {
        ambientLightSlider.addEventListener('input', function() {
            updateAmbientLight(parseFloat(this.value));
        });
    }
    
    const directionalLightSlider = document.getElementById('directional-light');
    if (directionalLightSlider) {
        directionalLightSlider.addEventListener('input', function() {
            updateDirectionalLight(parseFloat(this.value));
        });
    }
    
    const spotlightToggle = document.getElementById('spotlight-toggle');
    if (spotlightToggle) {
        spotlightToggle.addEventListener('change', function() {
            toggleSpotlight(this.checked);
        });
    }
    
    const mediaTabs = document.getElementById('media-tabs');
    if (mediaTabs) {
        const tabLinks = mediaTabs.querySelectorAll('.nav-link');
        
        tabLinks.forEach(function(tabLink) {
            tabLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                tabLinks.forEach(function(link) {
                    link.classList.remove('active');
                });
                
                this.classList.add('active');
                
                const tabId = this.getAttribute('href');
                const tabContents = document.querySelectorAll('.tab-pane');
                
                tabContents.forEach(function(content) {
                    content.classList.remove('show', 'active');
                });
                
                const activeContent = document.querySelector(tabId);
                if (activeContent) {
                    activeContent.classList.add('show', 'active');
                }
            });
        });
    }
    
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case '1':
                document.getElementById('model1-btn').click();
                break;
            case '2':
                document.getElementById('model2-btn').click();
                break;
            case '3':
                document.getElementById('model3-btn').click();
                break;
            case 'w':
                document.getElementById('wireframe-btn').click();
                break;
            case 'r':
                document.getElementById('rotate-btn').click();
                break;
            case 'Home':
                resetView();
                break;
            case 'f':
                document.getElementById('fullscreen-btn').click();
                break;
        }
    });
    
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'btn btn-sm btn-outline-secondary m-1';
    themeToggleBtn.innerHTML = '<i class="fas fa-palette me-1"></i>Toggle Theme';
    
    const visualizationControls = document.querySelector('.card-body .mb-4:first-child .d-flex');
    if (visualizationControls) {
        visualizationControls.appendChild(themeToggleBtn);
        
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                this.classList.remove('btn-outline-secondary');
                this.classList.add('btn-outline-light');
            } else {
                this.classList.remove('btn-outline-light');
                this.classList.add('btn-outline-secondary');
            }
        });
    }
    
    const darkThemeStyle = document.createElement('style');
    darkThemeStyle.textContent = `
        body.dark-theme {
            background-color: #222;
            color: #f8f9fa;
        }
        
        body.dark-theme .card {
            background-color: #333;
            color: #f8f9fa;
        }
        
        body.dark-theme .btn-outline-secondary {
            color: #adb5bd;
            border-color: #adb5bd;
        }
        
        body.dark-theme .btn-outline-secondary:hover {
            background-color: #adb5bd;
            color: #212529;
        }
    `;
    document.head.appendChild(darkThemeStyle);
    
    const helpBtn = document.createElement('button');
    helpBtn.className = 'btn btn-sm btn-outline-info m-1';
    helpBtn.innerHTML = '<i class="fas fa-question-circle me-1"></i>Help';
    
    if (visualizationControls) {
        visualizationControls.appendChild(helpBtn);
        
        helpBtn.addEventListener('click', function() {
            const modalHTML = `
                <div class="modal fade" id="helpModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-dark text-white">
                                <h5 class="modal-title">Keyboard Shortcuts</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Function</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd></td>
                                            <td>Select model</td>
                                        </tr>
                                        <tr>
                                            <td><kbd>w</kbd></td>
                                            <td>Toggle wireframe mode</td>
                                        </tr>
                                        <tr>
                                            <td><kbd>r</kbd></td>
                                            <td>Toggle auto-rotation</td>
                                        </tr>
                                        <tr>
                                            <td><kbd>f</kbd></td>
                                            <td>Toggle fullscreen</td>
                                        </tr>
                                        <tr>
                                            <td><kbd>Home</kbd></td>
                                            <td>Reset view</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <h6 class="mt-3">Mouse Controls</h6>
                                <ul>
                                    <li>Left-click + drag: Rotate view</li>
                                    <li>Right-click + drag: Pan view</li>
                                    <li>Scroll: Zoom in/out</li>
                                </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
            
            const helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
            helpModal.show();
            
            document.getElementById('helpModal').addEventListener('hidden.bs.modal', function() {
                modalContainer.remove();
            });
        });
    }
});