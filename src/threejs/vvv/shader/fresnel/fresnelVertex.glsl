void main(){

    vPositionW = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
    wPosition = vec3(modelMatrix * vec4(position, 1.0)).xyz;
    vNormalW = normalize(normalMatrix * normal);
