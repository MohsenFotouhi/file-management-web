import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summerize',
  standalone: true
})
export class SummerizePipe implements PipeTransform
{

  transform(value: string, ...args: any[]): unknown
  {
    console.log('this.measureText(value, 15)', this.measureText(value, '15'), 'args', args[0]);
    //console.log(document.getElementById("files-container")?.offsetWidth);
    //console.log();
    if (this.measureText(value, '15') > args[0])
    {
      const startString = value.substring(0, 20);
      const endString = value.substring(-1, 20);
      value = `${ startString + ' ... ' + endString }`;
      console.log(value);
    }
    return value;
  }


  measureText(pText: string, pFontSize: string, pStyle: string | null = null): any
  {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);


    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";

    lDiv.textContent = pText;

    var lResult = {
      width: lDiv.clientWidth,
      height: lDiv.clientHeight
    };

    document.body.removeChild(lDiv);

    return lResult.width;
  }
}
