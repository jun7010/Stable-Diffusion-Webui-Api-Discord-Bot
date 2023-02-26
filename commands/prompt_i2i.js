const { SlashCommandBuilder } = require('discord.js');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const Promise = require('promise');
const fs = require("fs");
const request = require('request').defaults({ encoding: null });
require('date-utils');


const func = {};

const { url_i2i } = require('../config.json');
//const url_txt = "http://127.0.0.1:7860/sdapi/v1/txt2img"

let number = 0;

func.createimg2Img2 = async (this_number, tags, negative_tags, step, scale, sampler, batch, image_url, strength, quality, file_name) => {
    return new Promise(async (resolve, reject) => {

        let width;
        let height;
        let sampler_name;

        if(sampler == 1) {
            sampler_name = 'DPM++ SDE Karras';
        } else if(sampler == 2) { 
            sampler_name = 'DPM++ 2S a Karras';
        } else {
            sampler_name = 'DPM++ SDE Karras';
        }

        if(quality == 2) {
            width = 512;
            height = 768;
        } else if(quality == 1) {
            width = 615;
            height = 921;
        } else {
            width = 768;
            height = 1152;
        }


        request.get(image_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = Buffer.from(body).toString('base64');
                //data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                console.log("request end data : ");
                console.log(data);

                fetch(url_i2i, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify({ 
                            "init_images": [ 
                                "\"" + data + "\""
                            ],
                            "prompt": tags,
                            "negative_prompt": negative_tags,
                            "steps": step,
                            "cfg_scale": scale,
                            "sampler_index": sampler_name,
                            "batch_size": batch,
                            "denoising_strength": strength,
                            "width": width,
                            "height": height,
                            "resize_mode": 3,
                    })
                }).then((response) => 
                    response.json()
                ).then(async (data) => {
                    console.log(this_number + " DATA : ");
                    console.log(data)
        
        
                    await func.createTxt2ImgFor(this_number, data.images, batch, file_name)
                    .then((returns) => {
                        return resolve(this_number);
                    }).catch((error) => {
                        console.log("createTxt2Img error : " , error);
                        return reject(error);
                    });
        
        
                })
                .catch(error => {
                    console.warn(error);
                    return reject(error);
                });
            } else {
                return reject(error);
            }
        });




    });
};


func.createTxt2ImgFor = async (this_number, images, batch_size, file_name) => {
    return new Promise(async (resolve, reject) => {


        const promise1 = new Promise((resolve, reject) => {
                let imgbase64 = images[0];
                let base64String = 'data:image/png;base64,' + imgbase64; // Not a real image
                // Remove header
                let base64Image = base64String.split(';base64,').pop();
                fs.writeFile(file_name + '_1.png', base64Image, {encoding: 'base64'}, function(err) {
                    console.log("write file created");
                    if(!err || err === undefined || err.length == 0) {
                        resolve(this_number);
                    } else {
                        console.log("write file error : " , err);
                        reject(err);
                    }
                });
        });

        
        const promise2 = new Promise((resolve, reject) => {
                if(batch_size >= 2) {
                    let imgbase64 = images[1];
                    let base64String = 'data:image/png;base64,' + imgbase64; // Not a real image
                    // Remove header
                    let base64Image = base64String.split(';base64,').pop();
                    fs.writeFile(file_name + '_2.png', base64Image, {encoding: 'base64'}, function(err) {
                        console.log("write file created");
                        if(!err || err === undefined || err.length == 0) {
                            resolve(this_number);
                        } else {
                            console.log("write file error : " , err);
                            reject(err);
                        }
                    });
                } else {
                    resolve(this_number);
                }
        });

        const promise3 = new Promise((resolve, reject) => {
                if(batch_size >= 3) {
                    let imgbase64 = images[2];
                    let base64String = 'data:image/png;base64,' + imgbase64; // Not a real image
                    // Remove header
                    let base64Image = base64String.split(';base64,').pop();
                    fs.writeFile(file_name + '_3.png', base64Image, {encoding: 'base64'}, function(err) {
                        console.log("write file created");
                        if(!err || err === undefined || err.length == 0) {
                            resolve(this_number);
                        } else {
                            console.log("write file error : " , err);
                            reject(err);
                        }
                    });
                } else {
                    resolve(this_number);
                }
        });

        const promise4 = new Promise((resolve, reject) => {
                if(batch_size >= 3) {
                    let imgbase64 = images[3];
                    let base64String = 'data:image/png;base64,' + imgbase64; // Not a real image
                    // Remove header
                    let base64Image = base64String.split(';base64,').pop();
                    fs.writeFile(file_name + '_4.png', base64Image, {encoding: 'base64'}, function(err) {
                        console.log("write file created");
                        if(!err || err === undefined || err.length == 0) {
                            resolve(this_number);
                        } else {
                            console.log("write file error : " , err);
                            reject(err);
                        }
                    });
                } else {
                    resolve(this_number);
                }
        });

        
        Promise.allSettled([promise1, promise2, promise3, promise4]).then((results) => {
            return resolve(this_number);
          });

    });
};


module.exports = {
	data: new SlashCommandBuilder()
		.setName('prompt_i2i')
		.setDescription('please input image tags and options')
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('image_url')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('strength')
                .setDescription('변화의 강도를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '거의 안바뀜', value: '0.2' },
                    { name: '조금 바뀜', value: '0.3' },
                    { name: '조금 더 바뀜', value: '0.4' },
                    { name: '중간 바뀜/원형유지 마지노선', value: '0.5' },
                    { name: '꽤 바뀜/구도가 달라지는 기준', value: '0.6' },
                    { name: '많이 바뀜', value: '0.7' },
                    { name: '대부분 바뀜(기본값)', value: '0.75' },
                    { name: '거의 다 바뀜', value: '0.9' }
                ))
        .addStringOption(option =>
            option.setName('tags')
                .setDescription('tags list')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('negative_tags')
                .setDescription('negative tags list')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('quality')
                .setDescription('해상도를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '512x768', value: '2' },
                    { name: '768x1152', value: '0' },
                    { name: '615x921', value: '1' }
                ))
        .addIntegerOption(option =>
            option.setName('step')
                .setRequired(true)
                .setDescription('샘플링횟수 (최소 11 이상, 20 이상권장 / 너무 크면 오래걸림)'))
        .addStringOption(option =>
            option.setName('sampler')
                .setDescription('샘플러를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: 'DPM++ SDE Karras', value: '0' },
                    { name: 'DPM++ 2M Karras', value: '1' },
                    { name: 'DPM++ 2S a Karras', value: '2' }
                ))
        .addIntegerOption(option =>
            option.setName('scale')
                .setRequired(true)
                .setDescription('태그 스케일 강도 (6~12권장)'))
        .addStringOption(option =>
            option.setName('batch')
                .setRequired(true)
                .setDescription('여러장 뽑을까요? 부하가 심해질수있습니다')
                .addChoices(
                    { name: '1', value: '1' },
                    { name: '2', value: '2' },
                    { name: '4', value: '4' }
                ))
        .addStringOption(option =>
            option.setName('spoiler')
                .setDescription('스포일러여부')
                .setRequired(true)
                .addChoices(
                    { name: 'Y', value: '1' },
                    { name: 'N', value: '0' }
                )),
	async execute(interaction) {

        let newDate = new Date();
        let this_number = newDate.toFormat('YYYYMMDDHH24MISS');
        //let this_number = number++;
        const image_url = interaction.options.getString('image_url') ?? '';
        const strength = interaction.options.getString('strength') ?? '';
        const tags = interaction.options.getString('tags') ?? '';
        const negative_tags = interaction.options.getString('negative_tags') ?? '';
        const step = interaction.options.getInteger('step') ?? '';
        const scale = interaction.options.getInteger('scale') ?? '';
        const sampler = interaction.options.getString('sampler') ?? '';
        const quality = interaction.options.getString('quality') ?? '';
        const batch = interaction.options.getString('batch') ?? '1';
        const spoiler = interaction.options.getString('spoiler') ?? '1';

        let file_name;

        if(spoiler == 0) { //false
            file_name = "output/" + this_number;
        } else { //true
            file_name = "output/SPOILER_" + this_number;
        }

        console.log(`input tags : ${tags}`);
        console.log(`input negative tags : ${negative_tags}`);
        await interaction.deferReply();

        await func.createimg2Img2(this_number, tags, negative_tags, step, scale, sampler, batch, image_url, strength, quality, file_name)
        .then(async (returns) => {
            console.log("createimg2Img return : " , returns);


            try {
                let embed_list = [];
                let file_list = [];
                if(batch >= 1) {
                    const file = new AttachmentBuilder(file_name + '_1.png');
                    const exampleEmbed = new EmbedBuilder()
                        .setImage('attachment://' + file_name + '_1.png');
                
                    embed_list.push(exampleEmbed);
                    file_list.push(file);
                        
                }
                if(batch >= 2) { 
                    const file2 = new AttachmentBuilder(file_name + '_2.png');
                    
                    const exampleEmbed2 = new EmbedBuilder()
                    .setImage('attachment://' + file_name + '_2.png');
                    
                    embed_list.push(exampleEmbed2);
                    file_list.push(file2);

                } 
                if(batch >= 4) {
                    const file3 = new AttachmentBuilder(file_name + '_3.png');
                    const file4 = new AttachmentBuilder(file_name + '_4.png');

                    const exampleEmbed3 = new EmbedBuilder()
                        .setImage('attachment://' + file_name + '_3.png');
                    
                    const exampleEmbed4 = new EmbedBuilder()
                    .setImage('attachment://' + file_name + '_4.png');

                    embed_list.push(exampleEmbed3);
                    file_list.push(file3);
                    embed_list.push(exampleEmbed3);
                    file_list.push(file4);

                }

                interaction.channel.send({ files: file_list });

                await wait(100);
                await interaction.editReply(`input tag : ${tags} / nagative_tag : ${negative_tags}`);

            } catch(e) {
                console.log("createimg2Img2 exception : " , e);
                await wait(100);
                await interaction.editReply(`IMAGE CREATE ERROR`);
            }


        }).catch(async (error) => {
            console.log("createTxt2Img error : " , error);
            await wait(100);
            await interaction.editReply(`IMAGE CREATE ERROR`);
        });
        
	},
};




