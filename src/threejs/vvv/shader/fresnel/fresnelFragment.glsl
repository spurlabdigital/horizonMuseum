void main(){

    float front = -dot(vPositionW, normalize(vNormalW));
    float back = dot(vPositionW, normalize(vNormalW));

    float fresnelValue = max(front, back);
//    float fresnelValue = front;
    fresnelValue = pow(1.0 - fresnelValue, fresnelPower);

    float borderHighlight =  pow(fresnelValue, borderSharpness);

    borderHighlight = min(1.0, borderHighlight);
    borderHighlight = max(minFresnelValue, borderHighlight);

    float fog = 1.0- length(wPosition)/fogPower;


    float alphaOut = alpha;

    alphaOut = pow(alpha * clip, 0.5);
    borderHighlight = mix(1.0, borderHighlight, clip);
    vec4 fresnelColor = vec4(glowColor, borderHighlight * alphaOut);

    gl_FragColor =  fresnelColor*fog;

