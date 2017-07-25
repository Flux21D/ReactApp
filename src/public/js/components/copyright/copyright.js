import React from "react";

class Copyright extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
            <div id="terms" className="bg-grey">
                <div className="terms-content">
                    <h2 className="content-title">Copyright</h2>

                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                    <p>Morbi quis mi sit amet leo elementum vulputate ut quis mauris. Pellentesque quis laoreet diam.
                        Vestibulum id quam tempor diam fermentum ultricies. Nunc hendrerit condimentum interdum.</p>

                    <p>Duis cursus, nisi vel lacinia feugiat, mauris mi vehicula nisi, ac volutpat diam mauris et elit.
                        Quisque gravida pellentesque eros vitae aliquam. Morbi fringilla pharetra metus venenatis
                        mollis. Etiam eu arcu consectetur, dapibus dolor in, ultrices nisl. Fusce ultrices lectus nulla,
                        quis sollicitudin diam sollicitudin aliquet. Etiam aliquam mauris et gravida pulvinar. Maecenas
                        gravida ultrices orci a bibendum. Morbi in interdum orci. Sed laoreet convallis nunc sed
                        ultrices. Integer ut nisi mauris. Pellentesque porta pulvinar justo sed condimentum. Cum sociis
                        natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>

                    <p>Ut consectetur, sem vitae ornare hendrerit, metus felis auctor leo, non gravida nisl justo vel
                        est. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                        Phasellus suscipit mi id enim malesuada, non finibus ligula venenatis.</p>
                </div>

            </div>
    );

  }

}

export default Copyright;