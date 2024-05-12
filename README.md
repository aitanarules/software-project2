# Software project

This is the Hyperloop UPV Training Center project from the Software subsystem. Here you'll find a real-time visualization for the POD data simulator. Find more details at GitHub



## How should I use this?

First, you need to download the files of this repository:
> git clone https://github.com/aitanarules/software-project2.git

> cd hand-recognition

Secondly, you will need to run the simulator server and the UDP client in order to send and receive the data. You should do it in different terminals.
> node /js/udp_simulator.js

> node /js/udp_client.js

Then, you can finally see the results. Just open the index.html.


## Which modules did I use?

I used `dgram` and `ws` for the UDP and TCP connection; `fs` (fyle system) module to save data; `plotly` to plot data.


## Results

![alt text](/images/image.png)
![alt text](/images/image-1.png)
