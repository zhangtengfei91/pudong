function init() {
    var scene, camera, renderer;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
    camera.position.set(3, 4, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    //1.0
    var geometry1 = new THREE.BoxGeometry(1, 1, 1);
    var material1 = new THREE.MeshNormalMaterial();
    var cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.set(1, 1, 1);
    scene.add(cube1);

    var geometry2 = new THREE.BoxGeometry(1, 1, 1);
    var material2 = new THREE.MeshNormalMaterial();
    var cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.set(2, -1, -5);
    cube2.rotation.set(2, 2, 2);
    scene.add(cube2);

    var geometry3 = new THREE.BoxGeometry(1, 1, 1);
    var material3 = new THREE.MeshNormalMaterial();
    var cube3 = new THREE.Mesh(geometry3, material3);
    cube3.position.set( - 3, -3, 0);
    cube3.rotation.set(3, 3, 3);
    scene.add(cube3);

    //0.5
    var geometry4 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material4 = new THREE.MeshNormalMaterial();
    var cube4 = new THREE.Mesh(geometry4, material4);
    cube4.position.set(3, -0.5, 0);
    cube4.rotation.set(4, 4, 4);
    scene.add(cube4);

    var geometry5 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material5 = new THREE.MeshNormalMaterial();
    var cube5 = new THREE.Mesh(geometry5, material5);
    cube5.position.set( - 3, 0, 2);
    cube5.rotation.set(5, 5, 5);
    scene.add(cube5);

    //0.2
    var geometry6 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material6 = new THREE.MeshNormalMaterial();
    var cube6 = new THREE.Mesh(geometry6, material6);
    cube6.position.set( - 2.5, 0.5, 1);
    cube6.rotation.set(6, 6, 6);
    scene.add(cube6);

    var geometry7 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material7 = new THREE.MeshNormalMaterial();
    var cube7 = new THREE.Mesh(geometry7, material7);
    cube7.position.set(2, 1, 1);
    cube7.rotation.set(7, 7, 7);
    scene.add(cube7);

    var geometry8 = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material8 = new THREE.MeshNormalMaterial();
    var cube8 = new THREE.Mesh(geometry8, material8);
    cube8.position.set( - 2.5, -1, 0);
    cube8.rotation.set(8, 8, 8);
    scene.add(cube8);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function render() {
        requestAnimationFrame(render);
        var cubes = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8];

        for (var i = 0; i < cubes.length; i++) {
            cubes[i].rotation.x += 0.01;
            cubes[i].rotation.y += 0.01;
        };

        renderer.render(scene, camera);
    }
    render();
}
init();