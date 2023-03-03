#include <stdio.h>
#include <graphics.h>
#include <math.h>
#include <conio.h>

int round(double);

void bresenham(int,int,int,int);
void transform();
void initIM();
void getPoints();
void drawPoly(int);
void rotate(double);
void translate(double,double);
void drawLine();

int color = WHITE,n;
double H[3][3]={{1.0,0.0,0.0},{0.0,1.0,0.0},{0.0,0.0,1.0}};
double * x = NULL, *y = NULL;
int gd=DETECT,gm,started = 0;
void main(){
    initIM();

    //drawPoly(n);
    drawLine();
    getch();
    translate(-x[0],-y[0]);
    rotate(30.0);
    transform();
    color = BLUE;
    drawLine();
    //drawPoly(n);
    getch();
    closegraph();
}

void getPoints(){
	int i;
	puts("Enter number of vertices : ");
	scanf("%d",&n);
	puts("Enter the vertices : ");
	x = (double*)calloc(n,sizeof(double));
	y = (double*)calloc(n,sizeof(double));
	for(i=0;i<n;i++){
		scanf("%lf %lf",&x[i],&y[i]);
	}
}

void drawLine(){
	int i;
	if(x==NULL || y == NULL)
		getPoints();
	if(!started){
		initgraph(&gd,&gm,"c:\\turboc3\\bgi");
		started = 1;
	}
	for(i=0;i<n-1;i++)
		bresenham(round(x[i]),round(y[i]),round(x[i+1]),round(y[i+1]));
}


void drawPoly(int n){
	int i;
	if(x==NULL || y == NULL)
		getPoints();
	if( n < 3){
		puts("Cannot draw a polygon.");
		return;
	}
	if(!started){
		initgraph(&gd,&gm,"c:\\turboc3\\bgi");
		started = 1;
	}
	for(i = 0;i<n;i++){
		//printf("\n%lf %lf",x[i],y[i]);
		bresenham(round(x[i]),round(y[i]),round(x[(i+1)%n]),round(y[(i+1)%n]));
	}
	return;
}

void transform(){
	int i;
	double temp;
	for(i = 0;i<n;i++){
		//printf("\n%lf,%lf\n",x[i],y[i]);
		temp = (double)(x[i]*H[0][0] + y[i]*H[1][0]+H[2][0]);
		y[i] = (double)(x[i] * H[0][1] + y[i]*H[1][1] + H[2][1]);
		x[i] = temp;
		//printf("%lf,%lf\n",x[i],y[i]);
	}
}

void initIM(){
	int i,j;
	for(i=0;i<3;i++)
		for(j=0;j<3;j++)
			H[i][j] = (i==j);
}

void rotate(double A){
	int i;
	double temp;
	double c = cos(A*((double)M_PI/180.0));
	double s = sin(A*((double)M_PI/180.0));
	for(i=0;i<3;i++){
		temp = (double)( H[i][0]*c - H[i][1]*s );
		H[i][1] = (double)(H[i][0]*s + H[i][1]*c);
		H[i][0] = temp;
	}
}

int round(double n){
	return floor(n+0.5);
}

void translate(double tx,double ty){
	//printf("%lf %lf",tx,ty);
	H[2][0] += tx;
	H[2][1] += ty;
	return;
}

void bresenham(int xa,int ya,int xb,int yb){
	int c,r,f,dx,dy,g,pos_slope,i1,i2;
	dx = xb - xa;
	dy = yb - ya;
	pos_slope = (dx > 0);
	if(dy < 0){
		pos_slope = !pos_slope;
	}
	if(abs(dx) >= abs(dy)){
		if(dx > 0)
			c = xa, r = ya,f = xb;
		else
			c = xb, r = yb,f = xa;
		i1 = 2*abs(dy);
		i2 = 2*(abs(dy) - abs(dx));
		g = 2*abs(dy) - abs(dx);
		if (pos_slope) {
			while(c<=f){
				putpixel(c,r,color);
				c++;
				if(g>=0){
					r++;
					g+=i2;
				}else{
					g+=i1;
				}
			}
		}else{
			while(c<=f){
				putpixel(c,r,color);
				c++;
				if(g>0){
					r--;
					g+=i2;
				}else{
					g+=i1;
				}
			}
		}
	}else{
	      if(dy > 0)
			c = ya, r = xa,f = yb;
		else
			c = yb, r = xb,f = ya;
		i1 = 2*abs(dx);
		i2 = 2*(abs(dx) - abs(dy));
		g = 2*abs(dx) - abs(dy);
		if (pos_slope) {
			while(c<=f){
				putpixel(r,c,color);
				c++;
				if(g>=0){
					r++;
					g+=i2;
				}else{
					g+=i1;
				}
			}
		}else{
			while(c<=f){
				putpixel(r,c,color);
				c++;
				if(g>0){
					r--;
					g+=i2;
				}else{
					g+=i1;
				}
			}
		}
	}
}

